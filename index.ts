import * as request from 'request'
import { URL } from 'url'
import { promises } from 'fs'
import { rejects } from 'assert'

interface Itoken {
  token: string
}

interface Iparam {
  prop: string
  val: string
}

const appName = 'node-rargb-api-ts'
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php'
const ratelimit = 2000
const requestOptions = {
  json: true,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
  }
}

class Common {
  private _token = ''
  private _ratelimit: number

  public get ratelimit () {
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

  public request<T> (url: string, options: request.CoreOptions = requestOptions): Promise<T> {
    return new Promise((resolve, reject) => {

      const complete = () => {
        request.get(url, requestOptions, (err, response) => {
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

  public get token (): Promise<string> {
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

  public async queryApi (...args: Iparam[]) {
    return new Promise(async (resolve, reject) => {
      const url = new URL(apiEndpoint)

      url.searchParams.append('app_id', appName)
      url.searchParams.append('token', await this.token)
      args.forEach(param => {
        url.searchParams.append(param.prop, param.val)
      })

      console.log(url.href)

      resolve(await this.request<string>(url.href))
    })
  }
}

export class Rargb {
  public common = new Common()
}

export const rargb = new Rargb()
