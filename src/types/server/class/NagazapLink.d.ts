import { Prisma } from "@prisma/client";
export interface NagazapLinkClick {
    timestamp: number;
}
type NagazapLinkPrisma = Prisma.NagazapLinkGetPayload<{}>;
export declare class NagazapLink {
    original_url: string;
    new_url: string;
    created_at: string;
    clicks: NagazapLinkClick[];
    nagazap_id: string;
    template_name: string;
    static findLink(url: string): Promise<NagazapLink>;
    constructor(data: NagazapLinkPrisma);
    click(): Promise<void>;
}
export {};
