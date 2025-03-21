import { WithoutFunctions } from "../helpers";
import { Chat } from "./Chat";
export type RoomDto = WithoutFunctions<Room>;
export interface RoomForm {
    name: string;
}
export declare class Room {
    id: string;
    name: string;
    chats: Chat[];
    entry_point?: boolean;
    on_new_chat?: {
        board_id: string;
        room_id?: string;
    };
    constructor(data: RoomDto);
    newMessage(chat: Chat): Promise<void>;
}
