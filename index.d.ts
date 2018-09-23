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
declare class Common {
    private _token;
    private _ratelimit;
    private _tokenExpire;
    private readonly tokenExpired;
    private readonly ratelimit;
    private request;
    private readonly token;
    queryApi(...params: Iparam[]): Promise<any>;
}
export declare class Rargb {
    protected common: Common;
    list(limit?: string): Promise<ItorrentResults>;
    search(searchString: string): Promise<ItorrentResults>;
}
export declare const rargb: Rargb;
export {};
