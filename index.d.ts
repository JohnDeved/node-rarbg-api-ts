interface Itorrent {
    filename: string;
    category: string;
    download: string;
}
interface ItorrentResults {
    torrent_results: Itorrent[];
}
interface Iparam {
    [key: string]: string;
}
interface Idefaults {
    limit: string;
    sort: string;
    format: string;
    ranked: string;
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
    static enums: typeof Enums;
    default: Idefaults;
    list(...params: Iparam[]): Promise<ItorrentResults>;
    search(searchString: string, ...params: Iparam[]): Promise<ItorrentResults>;
    searchImdb(imdbId: string, ...params: Iparam[]): Promise<any>;
    searchTvdb(tvdbId: string, limit?: string, ...params: Iparam[]): Promise<any>;
}
export declare const rargb: Rargb;
export {};
