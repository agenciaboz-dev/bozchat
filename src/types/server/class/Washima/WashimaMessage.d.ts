import { Prisma } from "@prisma/client";
import WAWebJS from "whatsapp-web.js";
import { WashimaMessageId } from "./Washima";
export type MessageType = "ptt" | "video" | "image" | "text" | "revoked" | "sticker" | "audio" | "chat" | "document" | "sticker";
export declare enum MessageAck {
    error = -1,
    pending = 0,
    sent = 1,
    received = 2,
    read = 3,
    played = 4
}
export type WashimaMessagePrisma = Prisma.WashimaMessageGetPayload<{}>;
export interface WashimaMessageForm {
    message: WAWebJS.Message;
    washima_id: string;
    chat_id: string;
    isGroup?: boolean;
}
export declare class WashimaMessage {
    sid: string;
    washima_id: string;
    chat_id: string;
    id: WashimaMessageId;
    author?: string | null;
    body: string;
    from: string;
    fromMe: boolean;
    hasMedia: boolean;
    timestamp: number;
    to: string;
    type: MessageType;
    ack?: MessageAck | null;
    edited: boolean;
    deleted: boolean;
    static getChatMessages(chat_id: string, offset?: number, take?: number | null): Promise<WashimaMessage[]>;
    static getWashimaMessages(washima_id: string, body?: any): Promise<WashimaMessage[]>;
    static search(value: string): Promise<WashimaMessage[]>;
    static new(data: WashimaMessageForm): Promise<WashimaMessage>;
    static update(message: WAWebJS.Message, options?: {
        edited?: boolean;
        deleted?: boolean;
    }): Promise<WashimaMessage | undefined>;
    constructor(data: WashimaMessagePrisma);
}
