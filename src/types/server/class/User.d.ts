import { Prisma } from "@prisma/client";
import { LoginForm } from "../types/shared/LoginForm";
import { WithoutFunctions } from "./helpers";
import { Washima } from "./Washima/Washima";
import { Nagazap } from "./Nagazap";
export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<WithoutFunctions<User>, "id" | "admin">;
export interface UserNotification {
    title: string;
    body: string;
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    admin: boolean;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getAll(): Promise<User[]>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static getUsersFromWashimaId(washima_id: string): Promise<User[]>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<User>): Promise<void>;
    getWashimas(): Washima[];
    getWashimasCount(): Promise<number>;
    getUnrepliedCount(): Promise<number>;
    getTotalStorage(): Promise<string>;
    getNagazapsCount(): Promise<number>;
    getNagazaps(): Promise<Nagazap[]>;
    getNagazapsTemplatesCount(): Promise<number>;
    getNagazapsLogsCount(): Promise<{
        success: number;
        error: number;
    }>;
    getBakingMessagesCount(): Promise<number>;
    getBlacklistedCount(): Promise<number>;
    notify(reason: string, data: UserNotification): void;
}
