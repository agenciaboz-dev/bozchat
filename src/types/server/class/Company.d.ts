import { Prisma } from "@prisma/client";
import { User, UserForm } from "./User";
import { Washima } from "./Washima/Washima";
import { Nagazap } from "./Nagazap";
import { WithoutFunctions } from "./helpers";
import { Address } from "./Address";
export type CompanyPrisma = Prisma.CompanyGetPayload<{}>;
export type CompanyForm = Omit<WithoutFunctions<Company>, "id" | "address"> & {
    address: WithoutFunctions<Address>;
    user: UserForm;
};
export declare class Company {
    id: string;
    full_name: string;
    business_name: string;
    document: string;
    address: Address;
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
}
