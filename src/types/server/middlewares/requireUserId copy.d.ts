import { NextFunction, Request, Response } from "express";
export declare const requireUserId: (request: Request, response: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
