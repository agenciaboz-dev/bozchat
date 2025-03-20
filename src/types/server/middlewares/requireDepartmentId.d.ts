import { NextFunction, Response } from "express";
import { CompanyRequest } from "./requireCompanyId";
import { Department } from "../class/Department";
export interface DepartmentRequest extends CompanyRequest {
    department?: Department;
}
export declare const requireDepartmentId: (request: DepartmentRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
