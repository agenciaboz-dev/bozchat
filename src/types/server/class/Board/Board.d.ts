import { Prisma } from "@prisma/client";
import { Room, RoomForm } from "./Room";
import { WithoutFunctions } from "../helpers";
import { Department } from "../Department";
import { User } from "../User";
import { Chat, ChatDto } from "./Chat";
import WAWebJS from "whatsapp-web.js";
import { Washima } from "../Washima/Washima";
import { WashimaMessage } from "../Washima/WashimaMessage";
import { Socket } from "socket.io";
export type BoardPrisma = Prisma.BoardGetPayload<{}>;
export interface BoardForm {
    name: string;
}
export interface BoardWashimaSettings {
    washima_id: string;
    washima_name: string;
    room_id?: string;
}
export interface BoardNagazapSettings {
    nagazap_id: string;
    nagazap_name: string;
    room_id?: string;
}
export interface HandleWashimaMessageDto {
    company_id: string;
    chat: WAWebJS.Chat;
    washima: Washima;
    message: WashimaMessage;
}
export interface HandleWashimaDeleteDto {
    washima_id: string;
    company_id: string;
}
export interface BoardAccess {
    users: User[];
    departments: Department[];
}
export declare class Board {
    id: string;
    name: string;
    created_at: string;
    rooms: Room[];
    entry_room_id: string;
    entry_room_index: number;
    company_id: string;
    washima_settings: BoardWashimaSettings[];
    nagazap_settings: BoardNagazapSettings[];
    static handleSocket(socket: Socket): void;
    static handleWashimaNewMessage(data: HandleWashimaMessageDto): Promise<void>;
    static getCompanyBoards(company_id: string): Promise<Board[]>;
    static find(board_id: string): Promise<Board>;
    static new(data: BoardForm, company_id: string): Promise<Board>;
    static handleWashimaDelete(data: HandleWashimaDeleteDto): Promise<void>;
    constructor(data: BoardPrisma);
    load(data: BoardPrisma): void;
    getEntryRoom(): Room;
    getEntryRoomIndex(): number;
    update(data: Partial<WithoutFunctions<Board & {
        departments?: Department[];
        users?: User[];
    }>>): Promise<void>;
    delete(): Promise<{
        name: string;
        id: string;
        company_id: string;
        created_at: string;
        rooms: Prisma.JsonValue;
        receive_washima_message: Prisma.JsonValue;
        entry_room_id: string;
    }>;
    saveRooms(): Promise<void>;
    newRoom(data: RoomForm): void;
    deleteRoom(room_id: string): void;
    updateRoom(updatedRoom: Room): void;
    newChat(chat: Chat, room_id?: string): Promise<void>;
    getWashimaSetting(washima_id: string): BoardWashimaSettings | undefined;
    handleWashimaMessage(chatDto: ChatDto): Promise<false | undefined>;
    handleWashimaSettingsChange(data: BoardWashimaSettings[]): Promise<boolean>;
    unsyncWashima(data: BoardWashimaSettings): void;
    syncWashima(data: BoardWashimaSettings): Promise<void>;
    handleWashimaDelete(washima_id: string): false | undefined;
    emit(event?: string, data?: any): void;
    getAccess(): Promise<{
        users: User[];
        departments: Department[];
    }>;
}
