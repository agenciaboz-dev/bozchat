import { NextFunction, Response } from "express";
import { CompanyRequest } from "./requireCompanyId";
import { Board } from "../class/Board/Board";
export interface BoardRequest extends CompanyRequest {
    board?: Board;
}
export declare const requireBoardId: (request: BoardRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
