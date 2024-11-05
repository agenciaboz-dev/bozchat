import { Prisma } from "@prisma/client";
import { LoginForm } from "../types/shared/LoginForm";
export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<User, "id" | "admin">;
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    admin: boolean;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static getUsersFromWashimaId(washima_id: string): Promise<User[]>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<User>): Promise<void>;
}
