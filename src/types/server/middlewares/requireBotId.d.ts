import { NextFunction, Response } from "express";
import { Bot } from "../class/Bot/Bot";
import { CompanyRequest } from "./requireCompanyId";
export interface BotRequest extends CompanyRequest {
    bot?: Bot;
}
export declare const requireBotId: (request: BotRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
