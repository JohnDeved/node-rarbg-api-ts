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
  error: string
  error_code: number
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
  private _tokenExpired: boolean

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
      if (this._token && !this._tokenExpired) {
        return resolve(this._token)
      }

      const url = new URL(apiEndpoint)
      url.searchParams.append('get_token', 'get_token')
      url.searchParams.append('app_id', appName)

      let result = await this.request<Itoken>(url.href)
        .catch((err) => console.error('Error fetching token:', err))

      if (result) {
        if (result.token) {
          this._tokenExpired = false
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
        .then((result: ItorrentResults) => {
          if (result.torrent_results) return resolve(result.torrent_results)
          if (result.error_code === 4) {
            console.info(`token ${this._token} is expired... requesting new one`)
            this._tokenExpired = true
            return resolve(this.queryApi(...params))
          }
          if (result.error_code) return reject(`Error ${result.error_code}: ${result.error}`)
          return reject(result)
        })
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

export class Rarbg {
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
    return this.common.queryApi({ mode: 'list',
      ...this.common.applyParams(this.default, params) })
  }

  public async search (searchString: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    return this.common.queryApi({ mode: 'search', search_string: searchString,
      ...this.common.applyParams(this.default, params) })
  }

  public async searchImdb (imdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    return this.common.queryApi({ mode: 'search', search_imdb: imdbId,
      ...this.common.applyParams(this.default, params) })
  }

  public async searchTvdb (tvdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]> {
    return this.common.queryApi({ mode: 'search', search_tvdb: tvdbId,
      ...this.common.applyParams(this.default, params) })
  }
}

export const rarbg = new Rarbg()
