import { Prisma } from "@prisma/client";
import { Room, RoomForm } from "./Room";
import { WithoutFunctions } from "../helpers";
import { Department } from "../Department";
import { User } from "../User";
import { Chat, ChatDto } from "./Chat";
import WAWebJS from "whatsapp-web.js";
import { Washima } from "../Washima/Washima";
import { WashimaMessage } from "../Washima/WashimaMessage";
export type BoardPrisma = Prisma.BoardGetPayload<{}>;
export interface BoardForm {
    name: string;
}
export interface BoardWashimaSettings {
    washima_id: string;
    room_id?: string;
}
export interface HandleWashimaMessageDto {
    company_id: string;
    chat: WAWebJS.Chat;
    washima: Washima;
    message: WashimaMessage;
}
export declare class Board {
    id: string;
    name: string;
    created_at: string;
    rooms: Room[];
    entry_room_id: string;
    company_id: string;
    receive_washima_message: BoardWashimaSettings[];
    static handleWashimaNewMessage(data: HandleWashimaMessageDto): Promise<void>;
    static getCompanyBoards(company_id: string): Promise<Board[]>;
    static find(board_id: string): Promise<Board>;
    static new(data: BoardForm, company_id: string): Promise<Board>;
    constructor(data: BoardPrisma);
    load(data: BoardPrisma): void;
    update(data: Partial<WithoutFunctions<Board & {
        departments?: Department[];
        users?: User[];
    }>>): Promise<void>;
    delete(): Promise<{
        id: string;
        name: string;
        created_at: string;
        rooms: Prisma.JsonValue;
        receive_washima_message: Prisma.JsonValue;
        entry_room_id: string;
        company_id: string;
    }>;
    saveRooms(): Promise<void>;
    newRoom(data: RoomForm): void;
    deleteRoom(room_id: string): void;
    updateRoom(updatedRoom: Room): void;
    newChat(chat: Chat, room_id?: string): Promise<void>;
    handleWashimaMessage(chatDto: ChatDto): Promise<false | undefined>;
}
