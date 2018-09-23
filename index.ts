import * as request from 'request'
import { URL } from 'url'

interface Itoken {
  token: string
}

interface Iparam {
  [key: string]: string
}

const appName = 'node-rargb-api-ts'
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php'
const ratelimit = 2000
const requestOptions = {
  json: true,
  headers: {
    'User-Agent': 'UA'
  }
}

class Common {
  private _token = ''
  private _ratelimit: number

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
        request.get(url, options, (err, response) => {
          if (err) return reject(err)
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
    return new Promise(async (resolve, reject) => {
      if (this._token !== '') {
        return resolve(this._token)
      }

      const url = new URL(apiEndpoint)
      url.searchParams.append('get_token', 'get_token')
      url.searchParams.append('app_id', appName)

      console.log(url.href)

      const response = await this.request<Itoken>(url.href)
      resolve(response.token)
    })
  }

  public async queryApi (...params: Iparam[]) {
    return new Promise(async (resolve, reject) => {
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

      console.log(url.href)

      resolve(await this.request<string>(url.href))
    })
  }
}

export class Rargb {
  protected common = new Common()

  public list (limit?: string) {
    this.common.queryApi({ limit })
  }
}

export const rargb = new Rargb()
