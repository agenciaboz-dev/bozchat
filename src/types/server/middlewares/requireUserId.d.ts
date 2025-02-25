import { NextFunction, Request, Response } from "express";
import { User } from "../class/User";
export interface UserRequest extends Request {
    user?: User | null;
}
export declare const requireUserId: (request: UserRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
