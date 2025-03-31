import { WithoutFunctions } from "../helpers";
import { Chat } from "./Chat";
export type RoomDto = WithoutFunctions<Room>;
export interface RoomForm {
    name: string;
}
export interface RoomTrigger {
    board_id: string;
    board_name: string;
    room_id?: string;
}
export declare class Room {
    id: string;
    name: string;
    chats: Chat[];
    entry_point?: boolean;
    on_new_chat?: RoomTrigger;
    constructor(data: RoomDto);
    newMessage(chat: Chat): Promise<void>;
}
