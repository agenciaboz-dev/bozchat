import { Prisma } from "@prisma/client";
import { OvenForm, WhatsappForm } from "../types/shared/Meta/WhatsappBusiness/WhatsappForm";
import { UploadedFile } from "express-fileupload";
import { FailedMessageLog, SentMessageLog } from "../types/shared/Meta/WhatsappBusiness/Logs";
import { User } from "./User";
export type NagaMessagePrisma = Prisma.NagazapMessageGetPayload<{}>;
export type NagaMessageForm = Omit<Prisma.NagazapMessageGetPayload<{}>, "id">;
export declare const nagazap_include: {
    user: true;
};
export type NagazapPrisma = Prisma.NagazapGetPayload<{
    include: typeof nagazap_include;
}>;
interface BuildHeadersOptions {
    upload?: boolean;
}
export declare class NagaMessage {
    id: number;
    from: string;
    timestamp: string;
    text: string;
    name: string;
    constructor(data: NagaMessagePrisma);
}
export interface NagazapForm {
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    userId: string;
}
export declare class Nagazap {
    id: number;
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    lastUpdated: string;
    stack: WhatsappForm[];
    blacklist: string[];
    frequency: string;
    batchSize: number;
    lastMessageTime: string;
    paused: boolean;
    sentMessages: SentMessageLog[];
    failedMessages: FailedMessageLog[];
    userId: string;
    user: User;
    static initialize(): Promise<void>;
    static get(): Promise<Nagazap>;
    static shouldBake(): Promise<void>;
    constructor(data: NagazapPrisma);
    getMessages(): Promise<NagaMessage[]>;
    updateToken(token: string): Promise<void>;
    buildHeaders(options?: BuildHeadersOptions): {
        Authorization: string;
        "Content-Type": string;
    };
    getInfo(): Promise<any>;
    saveMessage(data: NagaMessageForm): Promise<NagaMessage>;
    addToBlacklist(number: string): Promise<void>;
    removeFromBlacklist(number: string): Promise<void>;
    getTemplates(): Promise<any>;
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
    emit(): void;
}
export {};
