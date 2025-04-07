import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
import { User } from "./User";
export declare const department_include: {
    users: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type DepartmentPrisma = Prisma.DepartmentGetPayload<{
    include: typeof department_include;
}>;
export type DepartmentForm = Omit<WithoutFunctions<Department>, 'id' | 'company_id' | 'users'> & {
    users: User[];
};
export interface DepartmentUserInfo {
    id: string;
    name: string;
}
export declare class Department {
    id: string;
    name: string;
    company_id: string;
    users: DepartmentUserInfo[];
    static find(id: string, options?: {
        users?: boolean;
    }): Promise<Department>;
    constructor(data: DepartmentPrisma);
    load(data: DepartmentPrisma): void;
    update(data: Partial<DepartmentForm>): Promise<{
        users: {
            id: string;
            name: string;
        }[];
    } & {
        id: string;
        name: string;
        company_id: string;
    }>;
    delete(): Promise<{
        id: string;
        name: string;
        company_id: string;
    }>;
}
