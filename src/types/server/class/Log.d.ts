import { Prisma } from "@prisma/client";
import { User } from "./User";
import { WithoutFunctions } from "./helpers";
export declare const log_include: {
    user: {
        include: {
            departments: {
                include: {
                    users: {
                        select: {
                            id: true;
                            name: true;
                        };
                    };
                };
            };
        };
    };
};
export type LogPrisma = Prisma.LogGetPayload<{
    include: typeof log_include;
}>;
export type LogForm = Omit<WithoutFunctions<Log>, "id" | "user" | "timestamp" | "type"> & {
    type?: LogType;
};
export type LogType = "washima" | "nagazap" | "chatbot" | "users" | "default" | "departments";
export declare class Log {
    id: string;
    timestamp: number;
    text: string;
    type: LogType;
    user_id: string;
    user: User;
    company_id: string;
    static new(data: LogForm): Promise<void>;
    constructor(data: LogPrisma);
}
