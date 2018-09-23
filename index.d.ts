import * as request from 'request';
interface Iparam {
    prop: string;
    val: string;
}
declare class Common {
    private _token;
    private _ratelimit;
    readonly ratelimit: boolean;
    request<T>(url: string, options?: request.CoreOptions): Promise<T>;
    readonly token: Promise<string>;
    queryApi(...args: Iparam[]): Promise<{}>;
}
export declare class Rargb {
    common: Common;
}
export declare const rargb: Rargb;
export {};
