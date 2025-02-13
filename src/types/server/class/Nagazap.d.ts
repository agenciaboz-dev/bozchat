import { Prisma } from "@prisma/client";
import { OvenForm, WhatsappForm } from "../types/shared/Meta/WhatsappBusiness/WhatsappForm";
import { UploadedFile } from "express-fileupload";
import { BlacklistLog, FailedMessageLog, SentMessageLog } from "../types/shared/Meta/WhatsappBusiness/Logs";
import { WithoutFunctions } from "./helpers";
import { BusinessInfo } from "../types/shared/Meta/WhatsappBusiness/BusinessInfo";
import { TemplateForm, TemplateFormResponse, TemplateInfo } from "../types/shared/Meta/WhatsappBusiness/TemplatesInfo";
import { Company } from "./Company";
import { Socket } from "socket.io";
import { NagazapLink } from "./NagazapLink";
export type NagaMessageType = "text" | "reaction" | "sticker" | "image" | "audio" | "video" | "button";
export type NagaMessagePrisma = Prisma.NagazapMessageGetPayload<{}>;
export type NagaMessageForm = Omit<Prisma.NagazapMessageGetPayload<{}>, "id" | "nagazap_id">;
export declare const nagazap_include: {
    company: true;
};
export type NagazapPrisma = Prisma.NagazapGetPayload<{
    include: typeof nagazap_include;
}>;
export interface NagazapResponseForm {
    number: string;
    text: string;
}
interface BuildHeadersOptions {
    upload?: boolean;
}
export declare class NagaMessage {
    id: number;
    from: string;
    timestamp: string;
    text: string;
    name: string;
    type: NagaMessageType;
    constructor(data: NagaMessagePrisma);
}
export interface NagazapForm {
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    companyId: string;
}
export declare class Nagazap {
    id: string;
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    lastUpdated: string;
    stack: WhatsappForm[];
    blacklist: BlacklistLog[];
    frequency: string;
    batchSize: number;
    lastMessageTime: string;
    paused: boolean;
    sentMessages: SentMessageLog[];
    failedMessages: FailedMessageLog[];
    displayName: string | null;
    displayPhone: string | null;
    companyId: string;
    company: Company;
    static initialize(): Promise<void>;
    static new(data: NagazapForm): Promise<Nagazap>;
    static getByBusinessId(business_id: string): Promise<Nagazap>;
    static getById(id: string): Promise<Nagazap>;
    static getByCompanyId(company_id: string): Promise<Nagazap[]>;
    static getAll(): Promise<Nagazap[]>;
    static shouldBake(): Promise<void>;
    static delete(id: string): Promise<{
        id: string;
        token: string;
        lastUpdated: string;
        appId: string;
        phoneId: string;
        businessId: string;
        stack: string;
        blacklist: string;
        frequency: string;
        batchSize: number;
        lastMessageTime: string;
        paused: boolean;
        sentMessages: string;
        failedMessages: string;
        displayName: string | null;
        displayPhone: string | null;
        companyId: string;
    }>;
    static sendResponse(id: string, data: NagazapResponseForm, socket?: Socket): Promise<void>;
    constructor(data: NagazapPrisma);
    loadBlacklist(saved_list: any[]): BlacklistLog[];
    getMessages(): Promise<NagaMessage[]>;
    update(data: Partial<WithoutFunctions<Nagazap>>): Promise<this>;
    updateToken(token: string): Promise<void>;
    buildHeaders(options?: BuildHeadersOptions): {
        Authorization: string;
        "Content-Type": string;
    };
    getInfo(): Promise<BusinessInfo | undefined>;
    saveMessage(data: NagaMessageForm): Promise<NagaMessage>;
    addToBlacklist(number: string): Promise<void>;
    removeFromBlacklist(number: string): Promise<void>;
    getTemplates(): Promise<any>;
    getTemplate(template_id: string): Promise<TemplateInfo>;
    uploadMedia(file: UploadedFile, filepath: string): Promise<string>;
    sendMessage(message: WhatsappForm): Promise<void>;
    queueMessage(data: WhatsappForm): Promise<WhatsappForm[]>;
    queueBatch(data: WhatsappForm[]): Promise<WhatsappForm[]>;
    prepareBatch(data: OvenForm, image_id?: string): Promise<void>;
    updateOvenSettings(data: {
        batchSize?: number;
        frequency?: string;
    }): Promise<void>;
    saveStack(): Promise<void>;
    bake(): Promise<void>;
    pause(): Promise<void>;
    start(): Promise<void>;
    clearOven(): Promise<void>;
    log(data: any): Promise<void>;
    errorLog(data: any, number: string): Promise<void>;
    createTemplate(data: TemplateForm): Promise<TemplateFormResponse>;
    getTemplateSheet(template_name: string): string;
    exportTemplateModel(template: TemplateForm): Promise<string>;
    uploadTemplateMedia(file: UploadedFile): Promise<any>;
    downloadMedia(media_id: string): Promise<string>;
    emit(): void;
    sendResponse(data: NagazapResponseForm, socket?: Socket): Promise<void>;
    getLinks(): Promise<NagazapLink[]>;
    newLink(url: string, template_name?: string): Promise<NagazapLink>;
    findOriginalLink(url: string): Promise<NagazapLink | undefined>;
}
export {};
