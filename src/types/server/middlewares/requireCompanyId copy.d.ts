import { NextFunction, Request, Response } from "express";
import { Company } from "../class/Company";
export interface CompanyRequest extends Request {
    company?: Company;
}
export declare const requireCompanyId: (request: CompanyRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
