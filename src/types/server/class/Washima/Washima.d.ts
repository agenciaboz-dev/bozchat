import { Prisma } from "@prisma/client";
import WAWebJS, { Client, Message } from "whatsapp-web.js";
import { FileUpload, WithoutFunctions } from "../helpers";
import { Socket } from "socket.io";
import { WashimaMessage } from "./WashimaMessage";
import { WashimaGroupUpdate } from "./WashimaGroupUpdate";
import { Company } from "../Company";
export type WashimaPrisma = Prisma.WashimaGetPayload<{}>;
export type WashimaMediaPrisma = Prisma.WashimaMediaGetPayload<{}>;
export type WashimaProfilePicPrisma = Prisma.WashimaProfilePicGetPayload<{}>;
export interface WashimaDiskMetrics {
    messages: number;
    media: number;
}
export type WashimaForm = Omit<WithoutFunctions<Washima>, "id" | "created_at" | "active" | "client" | "qrcode" | "ready" | "info" | "chats" | "contact" | "companies" | "syncing"> & {
    company_id: string;
};
export interface WashimaMessageId {
    fromMe: boolean;
    id: string;
    remote: string;
    _serialized: string;
}
interface WashimaMediaFormHelper extends FileUpload {
    mimetype: string;
    base64: string;
    size?: number;
}
export type WashimaMediaForm = Omit<WashimaMediaFormHelper, "name"> & {
    name?: string;
    convertToFormat?: string;
};
export declare class WashimaProfilePic {
    chat_id: string;
    last_updated: string;
    url: string;
    constructor(data: WashimaProfilePicPrisma);
}
export declare class WashimaMedia {
    message_id: string;
    filename: string;
    data: string;
    mimetype: string;
    size: string;
    static new(data: WashimaMediaPrisma): Promise<WashimaMedia | undefined>;
    static get(message_id: string): Promise<WashimaMedia | undefined>;
    static getMetadata(message_id: string): Promise<WashimaMedia | undefined>;
    constructor(data: WashimaMediaPrisma);
}
export declare class Washima {
    id: string;
    name: string;
    number: string;
    created_at: string;
    active: boolean;
    ready: boolean;
    client: Client;
    qrcode?: string;
    info: WAWebJS.ClientInfo;
    chats: WAWebJS.Chat[];
    contact: string;
    diskMetrics?: WashimaDiskMetrics;
    companies: Company[];
    syncing: boolean;
    static washimas: Washima[];
    static waitingList: Washima[];
    static find(id: string): Washima | undefined;
    static query(id: string): Promise<Washima>;
    static list(): Promise<Washima[]>;
    static initialize(): Promise<void>;
    static push(washima: Washima): void;
    static new(data: WashimaForm): Promise<Washima>;
    static delete(washima_id: string): Promise<Washima | undefined>;
    static forwardMessage(socket: Socket, washima_id: string, chat_id: string, destinatary_ids: string[], message_ids: string[]): Promise<void>;
    static sendMessage(socket: Socket, washima_id: string, chat_id: string, message?: string, media?: WashimaMediaForm, replyMessage?: WashimaMessage): Promise<void>;
    static getContact(socket: Socket, washima_id: string, contact_id: string, message_id: string): Promise<void>;
    constructor(data: WashimaPrisma);
    initialize(queue?: Washima[]): Promise<void>;
    sendBulkGroupNotification(notification: WAWebJS.GroupNotification): Promise<void>;
    update(data: Partial<Washima>): Promise<void>;
    getContactPicture(target_id: string, target?: "chat" | "message"): Promise<WashimaProfilePic | undefined>;
    buildChat(id: string, offset?: number): Promise<{
        messages: WashimaMessage[];
        group_updates: WashimaGroupUpdate[] | undefined;
    } | {
        messages: WashimaMessage[];
        group_updates?: undefined;
    } | undefined>;
    getMessage(message_id: string): Promise<WAWebJS.Message>;
    sendMessage(chat_id: string, message?: string, media?: WashimaMediaForm, replyMessage?: WashimaMessage): Promise<void>;
    getContact(contact_id: string): Promise<string>;
    getMedia(message: Message): Promise<WashimaMedia | undefined>;
    restart(): Promise<void>;
    getMediaMeta(message_id: string): Promise<WashimaMedia | undefined>;
    cacheProfilePic(target_id: string, target?: "chat" | "message"): Promise<WashimaProfilePic | undefined>;
    getCachedMedia(message: Message): Promise<WashimaMedia | undefined>;
    getCachedProfilePicture(target_id: string, target?: "chat" | "message"): Promise<WashimaProfilePic | undefined>;
    fetchAndSaveAllMessages(options?: {
        groupOnly?: boolean;
    }): Promise<void>;
    getTableUsage(table: string, megabyte?: boolean): Promise<number>;
    getDiskUsage(megabyte?: boolean): Promise<WashimaDiskMetrics>;
    clearMedia(): Promise<number>;
    clearMessages(): Promise<number>;
    search(value: string): Promise<WAWebJS.Chat[]>;
    toJSON(): never;
}
export {};
