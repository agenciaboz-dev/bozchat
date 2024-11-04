import { Prisma } from "@prisma/client";
import { WashimaMessageId } from "./Washima";
import WAWebJS from "whatsapp-web.js";
export type GroupUpdateType = "add" | "invite" | "remove" | "leave" | "subject" | "description" | "picture" | "announce" | "restrict" | "create";
export type WashimaGroupUpdatePrisma = Prisma.WashimaGroupUpdatesGetPayload<{}>;
export interface WashimaGroupUpdateForm {
    notification: WAWebJS.GroupNotification;
    washima_id: string;
}
export interface WashimaNotificationId extends WashimaMessageId {
    fromMe: boolean;
}
export declare class WashimaGroupUpdate {
    sid: string;
    washima_id: string;
    chat_id: string;
    id: WashimaNotificationId;
    author: string;
    body: string;
    recipientIds: string[];
    timestamp: number;
    type: GroupUpdateType;
    static new(data: WashimaGroupUpdateForm): Promise<WashimaGroupUpdate>;
    static handleUpdate(data: WashimaGroupUpdateForm): Promise<void>;
    static getGroupUpdates(chat_id: string): Promise<WashimaGroupUpdate[] | undefined>;
    constructor(data: WashimaGroupUpdatePrisma);
}
