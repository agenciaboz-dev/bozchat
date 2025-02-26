import { Prisma } from "@prisma/client";
import { User } from "./User";
import { WithoutFunctions } from "./helpers";
export declare const log_include: {
    user: true;
};
export type LogPrisma = Prisma.LogGetPayload<{
    include: typeof log_include;
}>;
export type MuiColor = "primary" | "secondary" | "info" | "warning" | "error" | "success";
export type LogForm = Omit<WithoutFunctions<Log>, "id" | "user" | "timestamp" | "color"> & {
    color?: MuiColor;
};
export declare class Log {
    id: string;
    timestamp: number;
    text: string;
    color: MuiColor;
    user_id: string;
    user: User;
    company_id: string;
    static new(data: LogForm): Promise<void>;
    constructor(data: LogPrisma);
}
