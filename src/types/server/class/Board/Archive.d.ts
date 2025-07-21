import { WithoutFunctions } from "../helpers";
import { Chat } from "./Chat";
export type ArchiveDto = WithoutFunctions<Archive>;
export interface RestoreChatForm {
    chat_id: string;
    room_id?: string;
}
export interface ArchiveChatForm {
    chat_id: string;
}
export declare class Archive {
    chats: Map<string, Chat>;
    constructor(data: ArchiveDto);
    addChat(chat: Chat): void;
    getChats(): Chat[];
    restoreChat(chat_id: string): Chat | undefined;
}
