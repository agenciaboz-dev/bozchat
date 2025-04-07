import { Prisma } from "@prisma/client";
import { User, UserForm } from "./User";
import { Washima } from "./Washima/Washima";
import { Nagazap } from "./Nagazap";
import { WithoutFunctions } from "./helpers";
import { Address } from "./Address";
import { Bot, BotForm } from "./Bot/Bot";
import { Log } from "./Log";
import { Department, DepartmentForm } from "./Department";
export declare const company_include: {
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
export declare const admin_company_include: {
    _count: {
        select: {
            nagazaps: true;
            users: true;
            washimas: true;
        };
    };
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
export type CompanyPrisma = Prisma.CompanyGetPayload<{
    include: typeof company_include;
}>;
export type AdminCompanyPrisma = Prisma.CompanyGetPayload<{
    include: typeof admin_company_include;
}>;
export type CompanyForm = Omit<WithoutFunctions<Company>, "id" | "address" | "departments" | "active"> & {
    address: WithoutFunctions<Address>;
    user: UserForm;
};
export declare class Company {
    id: string;
    full_name: string;
    business_name: string;
    document: string;
    address: Address;
    departments: Department[];
    active: boolean;
    static getAll(): Promise<Company[]>;
    static getById(company_id: string): Promise<Company>;
    static getCompaniesFromWashimaId(washima_id: string): Promise<Company[]>;
    static signup(data: CompanyForm): Promise<{
        company: Company;
        user: User;
    }>;
    constructor(data: CompanyPrisma);
    newUser(data: UserForm): Promise<User>;
    getUsers(): Promise<User[]>;
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
    getBots(): Promise<Bot[]>;
    createBot(data: BotForm): Promise<Bot>;
    getLogs(): Promise<Log[]>;
    newDepartment(data: DepartmentForm): Promise<Department>;
    update(data: Partial<Company>): Promise<this>;
}
export declare class AdminCompany extends Company {
    usersCount: number;
    washimaCount: number;
    nagazapCount: number;
    diskUsed: string;
    static getAll(): Promise<AdminCompany[]>;
    constructor(data: AdminCompanyPrisma);
}
