import { URL } from 'url'
import axios, { AxiosResponse } from 'axios'

interface IepisodeInfo {
  imdb: string
  tvrage: null
  tvdb: string
  themoviedb: string
  airdate: string
  epnum: string
  seasonnum: string
  title: string
}

export interface Itorrent {
  error?: string
  error_code?: number
  filename: string
  category: string
  download: string
}

export interface ItorrentExtended extends Itorrent {
  title: string
  seeders: number
  leechers: number
  size: number
  pubdate: string
  episode_info: IepisodeInfo
  rankded: number
  info_page: string
}

interface ItorrentResults {
  torrent_results: Itorrent[] | ItorrentExtended[]
}

interface Itoken {
  token: string
}

interface Iparam {
  [key: string]: string
}

interface Idefaults {
  limit: string
  sort: string
  format: string
  ranked: string
  category: string
  min_seeders: string
  min_leechers: string
}

interface ILimit {
  SMALL: string
  MEDIUM: string
  BIG: string
}

interface ISort {
  SEEDERS: string
  LEECHERS: string
  LAST: string
}

interface ICategory {
  ALL: string
  TV: string
  MOVIES: string
  XXX: string
  GAMES: string
  MUSIC: string
}

interface IFormat {
  SHORT: string
  EXTENDED: string
}

interface IRanked {
  OTHER: string
  ONLY: string
}

interface Ienums {
  LIMIT: ILimit
  SORT: ISort
  CATEGORY: ICategory
  FORMAT: IFormat
  RANKED: IRanked
}

const appName = 'node-rarbg-api-ts'
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php'
const ratelimit = 2000
const tokenExpire = ((1000 * 60) * 15)

class Enums {
  public static LIMIT = {
    SMALL: '25',
    MEDIUM: '50',
    BIG: '100'
  }

  public static SORT = {
    SEEDERS: 'seeders',
    LEECHERS: 'leechers',
    LAST: 'last'
  }

  public static CATEGORY = {
    ALL: '',
    TV: 'tv',
    MOVIES: 'movies',
    XXX: '2;4',
    GAMES: '2;27;28;29;30;31;32;40;53',
    MUSIC: '2;23;24;25;26'
  }

  public static FORMAT = {
    SHORT: 'json',
    EXTENDED: 'json_extended'
  }

  public static RANKED = {
    OTHER: '0',
    ONLY: '1'
  }
}

class Common {
  private _token: string
  private _ratelimit: number
  private _tokenExpire: number

  private get tokenExpired () {
    if (!this._tokenExpire) {
      this._tokenExpire = Date.now() + tokenExpire
      return false
    }

    const expired = Date.now() > this._tokenExpire
    return expired
  }

  private get ratelimit () {
    if (!this._ratelimit) {
      this._ratelimit = Date.now() + ratelimit
      return false
    }

    const limit = this._ratelimit > Date.now()

    if (!limit) {
      this._ratelimit = Date.now() + ratelimit
    }

    return limit
  }

  private request<T> (url: string): Promise<T> {
    return new Promise((resolve, reject) => {

      const complete = () => {
        // console.log(url)
        axios.get(url)
          .then(response => resolve(response.data))
          .catch(reject)
      }

      const stall = () => {
        if (this.ratelimit) {
          setTimeout(() => stall(), 100)
        } else {
          complete()
        }
      }
      stall()
    })
  }

  private get token (): Promise<string> {
    return new Promise(async resolve => {
      if (this._token) {
        return resolve(this._token)
      }

      const url = new URL(apiEndpoint)
      url.searchParams.append('get_token', 'get_token')
      url.searchParams.append('app_id', appName)

      let result = await this.request<Itoken>(url.href)
        .catch((err) => console.error('Error fetching token:', err))

      if (result) {
        if (result.token) {
          this._tokenExpire = Date.now() + tokenExpire
          this._token = result.token
        }
      }

      resolve(this._token)
    })
  }

  public async queryApi (...params: Iparam[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const url = new URL(apiEndpoint)
      const token = await this.token

      url.searchParams.append('app_id', appName)
      url.searchParams.append('token', token)
      params.forEach(param => {
        Object.getOwnPropertyNames(param).forEach(key => {
          if (param[key]) {
            url.searchParams.append(key, param[key])
          }
        })
      })

      if (!token) return reject('Error: token undefined!')

      this.request(url.href)
        .then(resolve)
        .catch(reject)
    })
  }

  public applyParams (defaults: Idefaults, params: Iparam[]) {
    let appliedParams = defaults

    params.forEach(param => {
      Object.getOwnPropertyNames(param).forEach(key => {
        if (param[key] && defaults[key]) {
          appliedParams[key] = param[key]
        }
      })
    })

    return appliedParams
  }
}

export class rarbg {
  protected common = new Common()
  public enums: Ienums = Enums

  public default: Idefaults = {
    limit: Enums.LIMIT.SMALL,
    sort: Enums.SORT.LAST,
    format: Enums.FORMAT.SHORT,
    ranked: Enums.RANKED.ONLY,
    category: Enums.CATEGORY.ALL,
    min_seeders: '0',
    min_leechers: '0'
  }

  public async list (...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    const response: ItorrentResults = await this.common.queryApi({ mode: 'list',
      ...this.common.applyParams(this.default, params) })

    if (response.torrent_results) return response.torrent_results
    console.error('rarbg unexpected result:', JSON.stringify(response))
  }

  public async search (searchString: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    const response: ItorrentResults = await this.common.queryApi({ mode: 'search', search_string: searchString,
      ...this.common.applyParams(this.default, params) })

    if (response.torrent_results) return response.torrent_results
    console.error('rarbg unexpected result:', JSON.stringify(response))
  }

  public async searchImdb (imdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    const response: ItorrentResults = await this.common.queryApi({ mode: 'search', search_imdb: imdbId,
      ...this.common.applyParams(this.default, params) })

    if (response.torrent_results) return response.torrent_results
    console.error('rarbg unexpected result:', JSON.stringify(response))
  }

  public async searchTvdb (tvdbId: string, limit?: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    const response: ItorrentResults = await this.common.queryApi({ mode: 'search', search_tvdb: tvdbId,
      ...this.common.applyParams(this.default, params) })

    if (response.torrent_results) return response.torrent_results
    console.error('rarbg unexpected result:', JSON.stringify(response))
  }
}

export const rarbg = new rarbg()
