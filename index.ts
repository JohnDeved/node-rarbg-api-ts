import * as request from 'request'
import { URL } from 'url'

interface Itorrent {
  filename: string
  category: string
  download: string
}

interface ItorrentResults {
  torrent_results: Itorrent[]
}

interface Itoken {
  token: string
}

interface Iparam {
  [key: string]: string
}

interface Idefaults {
  limit: string,
  sort: string,
  format: string,
  ranked: string
}

const requestOptions = {
  json: true
}

const appName = 'node-rargb-api-ts'
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

  private request<T> (url: string, options: request.CoreOptions = requestOptions): Promise<T> {
    return new Promise((resolve, reject) => {

      const complete = () => {
        console.log(url)
        request.get(url, options, (err, response) => {
          if (err) return reject(err)
          if (response.statusCode !== 200) return reject(response.statusMessage)
          resolve(response.body)
        })
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

      if (!token) return reject('Error: token undefined!')

      url.searchParams.append('app_id', appName)
      url.searchParams.append('token', token)
      params.forEach(param => {
        Object.getOwnPropertyNames(param).forEach(key => {
          if (param[key]) {
            url.searchParams.append(key, param[key])
          }
        })
      })

      resolve(this.request(url.href))
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

export class Rargb {
  protected common = new Common()
  public static enums = Enums

  public default: Idefaults = {
    limit: Enums.LIMIT.SMALL,
    sort: Enums.SORT.LAST,
    format: Enums.FORMAT.SHORT,
    ranked: Enums.RANKED.ONLY
  }

  public list (...params: Iparam[]): Promise<ItorrentResults> {
    return this.common.queryApi({ mode: 'list',
      ...this.common.applyParams(this.default, params) })
  }

  public search (searchString: string, ...params: Iparam[]): Promise<ItorrentResults> {
    return this.common.queryApi({ mode: 'search', search_string: searchString,
      ...this.common.applyParams(this.default, params) })
  }

  public searchImdb (imdbId: string, ...params: Iparam[]) {
    return this.common.queryApi({ mode: 'search', search_imdb: imdbId,
      ...this.common.applyParams(this.default, params) })
  }

  public searchTvdb (tvdbId: string, limit?: string, ...params: Iparam[]) {
    return this.common.queryApi({ mode: 'search', search_imdb: tvdbId,
      ...this.common.applyParams(this.default, params) })
  }
}

export const rargb = new Rargb()
