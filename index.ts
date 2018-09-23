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

const requestOptions = {
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
  }
}

const appName = 'node-rargb-api-ts'
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php'
const ratelimit = 2000
const tokenExpire = ((1000 * 60) * 15)

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

  private request<T> (url: string, options: request.CoreOptions = requestOptions, getToken?: boolean): Promise<T> {
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

      let result = await this.request<Itoken>(url.href, null, true)
        .catch((err) => console.error('Error fetching token:', err))

      if (result) {
        if (result.token) {
          this._tokenExpire = Date.now() + tokenExpire
          this._token = result.token
        }
      }

      resolve(this._token || '50w8as762e')
    })
  }

  public async queryApi (...params: Iparam[]): Promise<any> {
    return new Promise(async resolve => {
      const url = new URL(apiEndpoint)

      url.searchParams.append('app_id', appName)
      url.searchParams.append('token', await this.token)
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
}

export class Rargb {
  protected common = new Common()

  public list (limit?: string): Promise<ItorrentResults> {
    return this.common.queryApi({ mode: 'list', limit })
  }

  public search (searchString: string): Promise<ItorrentResults> {
    return this.common.queryApi({ mode: 'search', search_string: searchString })
  }
}

export const rargb = new Rargb()
