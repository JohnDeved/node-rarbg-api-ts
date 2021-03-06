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
const url_1 = require("url");
const axios_1 = require("axios");
const appName = 'node-rarbg-api-ts';
const apiEndpoint = 'https://torrentapi.org/pubapi_v2.php';
const ratelimit = 2000;
class Enums {
}
Enums.LIMIT = {
    SMALL: '25',
    MEDIUM: '50',
    BIG: '100'
};
Enums.SORT = {
    SEEDERS: 'seeders',
    LEECHERS: 'leechers',
    LAST: 'last'
};
Enums.CATEGORY = {
    ALL: '',
    TV: 'tv',
    MOVIES: 'movies',
    XXX: '2;4',
    GAMES: '2;27;28;29;30;31;32;40;53',
    MUSIC: '2;23;24;25;26'
};
Enums.FORMAT = {
    SHORT: 'json',
    EXTENDED: 'json_extended'
};
Enums.RANKED = {
    OTHER: '0',
    ONLY: '1'
};
class Common {
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
    request(url) {
        return new Promise((resolve, reject) => {
            const complete = () => {
                // console.log(url)
                axios_1.default.get(url)
                    .then(response => resolve(response.data))
                    .catch(reject);
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
            if (this._token && !this._tokenExpired) {
                return resolve(this._token);
            }
            const url = new url_1.URL(apiEndpoint);
            url.searchParams.append('get_token', 'get_token');
            url.searchParams.append('app_id', appName);
            let result = yield this.request(url.href)
                .catch((err) => console.error('Error fetching token:', err));
            if (result) {
                if (result.token) {
                    this._tokenExpired = false;
                    this._token = result.token;
                }
            }
            resolve(this._token);
        }));
    }
    queryApi(...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const url = new url_1.URL(apiEndpoint);
                const token = yield this.token;
                url.searchParams.append('app_id', appName);
                url.searchParams.append('token', token);
                params.forEach(param => {
                    Object.getOwnPropertyNames(param).forEach(key => {
                        if (param[key]) {
                            url.searchParams.append(key, param[key]);
                        }
                    });
                });
                if (!token)
                    return reject('Error: token undefined!');
                this.request(url.href)
                    .then((result) => {
                    if (result.torrent_results)
                        return resolve(result.torrent_results);
                    if (result.error_code === 4) {
                        console.info(`token ${this._token} is expired... requesting new one`);
                        this._tokenExpired = true;
                        return resolve(this.queryApi(...params));
                    }
                    if (result.error_code)
                        return reject(`Error ${result.error_code}: ${result.error}`);
                    return reject(result);
                })
                    .catch(reject);
            }));
        });
    }
    applyParams(defaults, params) {
        let appliedParams = defaults;
        params.forEach(param => {
            Object.getOwnPropertyNames(param).forEach(key => {
                if (param[key] && defaults[key]) {
                    appliedParams[key] = param[key];
                }
            });
        });
        return appliedParams;
    }
}
class Rarbg {
    constructor() {
        this.common = new Common();
        this.enums = Enums;
        this.default = {
            limit: Enums.LIMIT.SMALL,
            sort: Enums.SORT.LAST,
            format: Enums.FORMAT.SHORT,
            ranked: Enums.RANKED.ONLY,
            category: Enums.CATEGORY.ALL,
            min_seeders: '0',
            min_leechers: '0'
        };
    }
    list(...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.common.queryApi(Object.assign({ mode: 'list' }, this.common.applyParams(this.default, params)));
        });
    }
    search(searchString, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.common.queryApi(Object.assign({ mode: 'search', search_string: searchString }, this.common.applyParams(this.default, params)));
        });
    }
    searchImdb(imdbId, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.common.queryApi(Object.assign({ mode: 'search', search_imdb: imdbId }, this.common.applyParams(this.default, params)));
        });
    }
    searchTvdb(tvdbId, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.common.queryApi(Object.assign({ mode: 'search', search_tvdb: tvdbId }, this.common.applyParams(this.default, params)));
        });
    }
}
exports.Rarbg = Rarbg;
exports.rarbg = new Rarbg();
