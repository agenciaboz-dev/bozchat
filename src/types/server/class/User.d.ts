import { Prisma } from "@prisma/client";
import { LoginForm } from "../types/shared/LoginForm";
export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<User, "id">;
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getUsersFromWashimaId(washima_id: string): Promise<User[]>;
    constructor(data: UserPrisma);
}
