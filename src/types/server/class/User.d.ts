import { Prisma } from "@prisma/client";
import { LoginForm } from "../types/shared/LoginForm";
import { WithoutFunctions } from "./helpers";
import { Department } from "./Department";
import { Board } from "./Board/Board";
export declare const user_include: {
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
export type UserPrisma = Prisma.UserGetPayload<{
    include: typeof user_include;
}>;
export type UserForm = Omit<WithoutFunctions<User>, "id" | "active" | "departments"> & {
    company_id: string;
    active?: boolean;
};
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
    owner: boolean;
    company_id: string;
    active: boolean;
    departments: Department[];
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getAll(): Promise<User[]>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static delete(user_id: string): Promise<User>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<User>): Promise<void>;
    notify(reason: string, data: UserNotification): void;
    getBoards(): Promise<Board[]>;
}
