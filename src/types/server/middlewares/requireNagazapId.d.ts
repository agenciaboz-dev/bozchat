import { NextFunction, Request, Response } from "express";
export declare const requireNagazapId: (request: Request, response: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
