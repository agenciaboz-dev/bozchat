import { Prisma } from "@prisma/client";
import WAWebJS, { Client, Message } from "whatsapp-web.js";
import { FileUpload } from "../helpers";
import { Socket } from "socket.io";
import { WashimaMessage } from "./WashimaMessage";
import { WashimaGroupUpdate } from "./WashimaGroupUpdate";
import { Company } from "../Company";
import { BoardAccess } from "../Board/Board";
import { Mutex } from "async-mutex";
import { WhatsappInteractiveForm } from "../Nagazap";
import { User } from "../User";
import { Department } from "../Department";
export type WashimaPrisma = Prisma.WashimaGetPayload<{}>;
export type WashimaMediaPrisma = Prisma.WashimaMediaGetPayload<{}>;
export type WashimaProfilePicPrisma = Prisma.WashimaProfilePicGetPayload<{}>;
export type WashimaStatus = "loading" | "ready" | "qrcode" | "error" | "stopped" | "pairingcode";
export interface WashimaDeleteMessagesForm {
    sids: string[];
    everyone?: boolean;
}
export interface WashimaDiskMetrics {
    messages: number;
    media: number;
}
export interface WashimaForm {
    company_id: string;
    number?: string;
}
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
    stopped: boolean;
    client: Client;
    qrcode?: string;
    info: WAWebJS.ClientInfo;
    chats: WAWebJS.Chat[];
    contact: string;
    diskMetrics?: WashimaDiskMetrics;
    companies: Company[];
    syncing: boolean;
    status: WashimaStatus;
    mutex: Mutex;
    static initializeBatch: number;
    static washimas: Washima[];
    static waitingList: Washima[];
    static initializing: Map<string, Washima>;
    static messagesQueue: Map<string, {
        washima: Washima;
        messages: {
            message: Message;
            ack?: boolean;
        }[];
    }>;
    static listInterval: NodeJS.Timeout;
    static find(id: string): Washima | undefined;
    static query(id: string): Promise<Washima>;
    static list(): Promise<Washima[]>;
    static initialize(): Promise<void>;
    static push(washima: Washima): void;
    static new(data: WashimaForm): Promise<Washima>;
    static delete(washima_id: string): Promise<Washima | undefined>;
    static forwardMessage(socket: Socket, washima_id: string, chat_id: string, destinatary_ids: string[], message_ids: string[]): Promise<void>;
    static newReaction(socket: Socket, washima_id: string, message_id: string, emoji: string): Promise<void>;
    static sendMessage(socket: Socket, washima_id: string, chat_id: string, message?: string, media?: WashimaMediaForm, replyMessage?: WashimaMessage): Promise<void>;
    static getContact(socket: Socket, washima_id: string, contact_id: string, message_id: string): Promise<void>;
    static deleteMessages(socket: Socket, washima_id: string, data: WashimaDeleteMessagesForm): Promise<void>;
    constructor(data: WashimaPrisma);
    handleAck(message: Message): Promise<void>;
    handleNewMessage(message: Message, sendingNow?: boolean, from_bot?: string): Promise<void>;
    initialize(): Promise<void>;
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
    sendMessage(chat_id: string, _text?: string, media?: WashimaMediaForm, replyMessage?: WashimaMessage, from_bot?: string, interactive?: WhatsappInteractiveForm): Promise<void>;
    getContact(contact_id: string): Promise<string>;
    getMedia(message: Message): Promise<WashimaMedia | undefined>;
    clearSingleton(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    getMediaMeta(message_id: string): Promise<WashimaMedia | undefined>;
    cacheProfilePic(target_id: string, target?: "chat" | "message"): Promise<WashimaProfilePic | undefined>;
    getCachedMedia(message: Message): Promise<WashimaMedia | undefined>;
    getCachedProfilePicture(target_id: string, target?: "chat" | "message"): Promise<WashimaProfilePic | undefined>;
    emit(): void;
    fetchAndSaveAllMessages(options?: {
        groupOnly?: boolean;
    }): Promise<void>;
    getTableUsage(table: string, megabyte?: boolean): Promise<number>;
    getDiskUsage(megabyte?: boolean): Promise<WashimaDiskMetrics>;
    clearMedia(): Promise<number>;
    clearMessages(): Promise<number>;
    search(value: string, target?: "chats" | "messages", chat_id?: string): Promise<WAWebJS.Chat[] | WashimaMessage[]>;
    setReady(): Promise<void>;
    setStopped(): Promise<void>;
    deleteMessages(data: WashimaDeleteMessagesForm): Promise<void>;
    getClientMessageBySid(sid: string): Promise<WAWebJS.Message>;
    newReaction(message_id: string, emoji: string): Promise<void>;
    getAccess(): Promise<{
        users: User[];
        departments: Department[];
    }>;
    changeAccess(access: BoardAccess): Promise<void>;
    getContactProfilePicFromWaid(waid: string): Promise<string>;
    toJSON(): never;
}
export {};
