import { Prisma } from "@prisma/client";
import WAWebJS, { Contact } from "whatsapp-web.js";
import { WashimaMessageId } from "./Washima";
export type MessageType =
    | "ptt"
    | "video"
    | "image"
    | "text"
    | "revoked"
    | "sticker"
    | "audio"
    | "chat"
    | "document"
    | "call_log"
    | "e2e_notification"
    | "notification_template"
    | "vcard"
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
    createOnly?: boolean;
    from_bot?: string;
}
export interface WashimaCall {
    isVideoCall: boolean;
    callDuration: number | null;
    callParticipants: any;
}
export interface WashimaReaction {
    id: string;
    orphan: number;
    orphanReason?: string;
    timestamp: number;
    reaction: string;
    read: boolean;
    msgId: object;
    msgSid: string;
    senderId: string;
    ack?: number;
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
    replied_to?: WashimaMessage | null;
    forwarded: boolean;
    phone_only: boolean | null;
    call: WashimaCall | null;
    contact_id: string | null;
    from_bot: string | null;
    reactions: Map<string, WashimaReaction>;
    static default_messages_offset: number;
    static getChatMessages(washima_id: string, chat_id: string, is_group: boolean, offset?: number, take?: number | null): Promise<WashimaMessage[]>;
    static getWashimaMessages(washima_id: string, body?: any): Promise<WashimaMessage[]>;
    static search(value: string, chat_id?: string): Promise<WashimaMessage[]>;
    static findBySid(sid: string): Promise<WashimaMessage | null>;
    static getBySid(sid: string): Promise<WashimaMessage>;
    static getByWrongId(id: string): Promise<WashimaMessage | null>;
    static new(data: WashimaMessageForm, author?: string, _contact?: Contact): Promise<WashimaMessage>;
    static update(message: WAWebJS.Message, options?: {
        edited?: boolean;
        deleted?: boolean;
    }): Promise<WashimaMessage | undefined>;
    static revoke(message: WAWebJS.Message): Promise<WashimaMessage | undefined>;
    constructor(data: WashimaMessagePrisma);
    handleReaction(reaction: WAWebJS.Reaction): Promise<void>;
    emit(): void;
    toJSON(): this & {
        reactions: WashimaReaction[];
    };
}
