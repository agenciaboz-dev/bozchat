import { NextFunction, Request, Response } from "express";
import { Washima } from "../class/Washima/Washima";
export interface WashimaRequest extends Request {
    washima?: Washima;
}
export declare const requireWashimaId: (request: WashimaRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
