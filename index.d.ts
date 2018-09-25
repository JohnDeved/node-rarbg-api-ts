interface IepisodeInfo {
    imdb: string;
    tvrage: null;
    tvdb: string;
    themoviedb: string;
    airdate: string;
    epnum: string;
    seasonnum: string;
    title: string;
}
export interface Itorrent {
    error?: string;
    error_code?: number;
    filename: string;
    category: string;
    download: string;
}
export interface ItorrentExtended extends Itorrent {
    title: string;
    seeders: number;
    leechers: number;
    size: number;
    pubdate: string;
    episode_info: IepisodeInfo;
    rankded: number;
    info_page: string;
}
interface Iparam {
    [key: string]: string;
}
interface Idefaults {
    limit: string;
    sort: string;
    format: string;
    ranked: string;
    category: string;
    min_seeders: string;
    min_leechers: string;
}
interface ILimit {
    SMALL: string;
    MEDIUM: string;
    BIG: string;
}
interface ISort {
    SEEDERS: string;
    LEECHERS: string;
    LAST: string;
}
interface ICategory {
    ALL: string;
    TV: string;
    MOVIES: string;
    XXX: string;
    GAMES: string;
    MUSIC: string;
}
interface IFormat {
    SHORT: string;
    EXTENDED: string;
}
interface IRanked {
    OTHER: string;
    ONLY: string;
}
interface Ienums {
    LIMIT: ILimit;
    SORT: ISort;
    CATEGORY: ICategory;
    FORMAT: IFormat;
    RANKED: IRanked;
}
declare class Common {
    private _token;
    private _ratelimit;
    private _tokenExpired;
    private readonly ratelimit;
    private request;
    private readonly token;
    queryApi(...params: Iparam[]): Promise<any>;
    applyParams(defaults: Idefaults, params: Iparam[]): Idefaults;
}
export declare class Rarbg {
    protected common: Common;
    enums: Ienums;
    default: Idefaults;
    list(...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    search(searchString: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    searchImdb(imdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    searchTvdb(tvdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
}
export declare const rarbg: Rarbg;
export {};
