import { WithoutFunctions } from "./helpers";
export type AddressForm = Omit<WithoutFunctions<Address>, "id">;
export declare class Address {
    cep: string;
    uf: string;
    city: string;
    number: string;
    district: string;
    street: string;
    complement: string | null;
    constructor(data: Address);
    format(options?: {
        short?: boolean;
    }): string;
}
