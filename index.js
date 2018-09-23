"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const url_1 = require("url");
const requestOptions = {
    json: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    }
};
const appName = 'node-rargb-api-ts';
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php';
const ratelimit = 2000;
const tokenExpire = ((1000 * 60) * 15);
class Common {
    get tokenExpired() {
        if (!this._tokenExpire) {
            this._tokenExpire = Date.now() + tokenExpire;
            return false;
        }
        const expired = Date.now() > this._tokenExpire;
        return expired;
    }
    get ratelimit() {
        if (!this._ratelimit) {
            this._ratelimit = Date.now() + ratelimit;
            return false;
        }
        const limit = this._ratelimit > Date.now();
        if (!limit) {
            this._ratelimit = Date.now() + ratelimit;
        }
        return limit;
    }
    request(url, options = requestOptions, getToken) {
        return new Promise((resolve, reject) => {
            const complete = () => {
                console.log(url);
                request.get(url, options, (err, response) => {
                    if (err)
                        return reject(err);
                    if (response.statusCode !== 200)
                        return reject(response.statusMessage);
                    resolve(response.body);
                });
            };
            const stall = () => {
                if (this.ratelimit) {
                    setTimeout(() => stall(), 100);
                }
                else {
                    complete();
                }
            };
            stall();
        });
    }
    get token() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this._token) {
                return resolve(this._token);
            }
            const url = new url_1.URL(apiEndpoint);
            url.searchParams.append('get_token', 'get_token');
            url.searchParams.append('app_id', appName);
            let result = yield this.request(url.href, null, true)
                .catch((err) => console.error('Error fetching token:', err));
            if (result) {
                if (result.token) {
                    this._tokenExpire = Date.now() + tokenExpire;
                    this._token = result.token;
                }
            }
            resolve(this._token || '50w8as762e');
        }));
    }
    queryApi(...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const url = new url_1.URL(apiEndpoint);
                url.searchParams.append('app_id', appName);
                url.searchParams.append('token', yield this.token);
                params.forEach(param => {
                    Object.getOwnPropertyNames(param).forEach(key => {
                        if (param[key]) {
                            url.searchParams.append(key, param[key]);
                        }
                    });
                });
                resolve(this.request(url.href));
            }));
        });
    }
}
class Rargb {
    constructor() {
        this.common = new Common();
    }
    list(limit) {
        return this.common.queryApi({ mode: 'list', limit });
    }
    search(searchString) {
        return this.common.queryApi({ mode: 'search', search_string: searchString });
    }
}
exports.Rargb = Rargb;
exports.rargb = new Rargb();
