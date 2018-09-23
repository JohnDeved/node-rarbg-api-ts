interface Iparam {
    [key: string]: string;
}
declare class Common {
    private _token;
    private _ratelimit;
    private readonly ratelimit;
    private request;
    private readonly token;
    queryApi(...params: Iparam[]): Promise<{}>;
}
export declare class Rargb {
    protected common: Common;
    list(limit?: string): void;
}
export declare const rargb: Rargb;
export {};
