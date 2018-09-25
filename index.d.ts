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
declare class Enums {
    static LIMIT: {
        SMALL: string;
        MEDIUM: string;
        BIG: string;
    };
    static SORT: {
        SEEDERS: string;
        LEECHERS: string;
        LAST: string;
    };
    static CATEGORY: {
        ALL: string;
        TV: string;
        MOVIES: string;
        XXX: string;
        GAMES: string;
        MUSIC: string;
    };
    static FORMAT: {
        SHORT: string;
        EXTENDED: string;
    };
    static RANKED: {
        OTHER: string;
        ONLY: string;
    };
}
declare class Common {
    private _token;
    private _ratelimit;
    private _tokenExpire;
    private readonly tokenExpired;
    private readonly ratelimit;
    private request;
    private readonly token;
    queryApi(...params: Iparam[]): Promise<any>;
    applyParams(defaults: Idefaults, params: Iparam[]): Idefaults;
}
export declare class Rargb {
    protected common: Common;
    enums: typeof Enums;
    default: Idefaults;
    list(...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    search(searchString: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    searchImdb(imdbId: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
    searchTvdb(tvdbId: string, limit?: string, ...params: Iparam[]): Promise<Itorrent[] | ItorrentExtended[]>;
}
export declare const rargb: Rargb;
export {};
