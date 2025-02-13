import { NextFunction, Request, Response } from "express";
import { Nagazap } from "../class/Nagazap";
export interface NagazapRequest extends Request {
    nagazap?: Nagazap;
}
export declare const requireNagazapId: (request: NagazapRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
