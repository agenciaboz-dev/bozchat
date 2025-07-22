import { Prisma } from "@prisma/client";
import { Room, RoomForm } from "./Room";
import { WithoutFunctions } from "../helpers";
import { Department } from "../Department";
import { User } from "../User";
import { Chat, ChatDto, CommentForm } from "./Chat";
import WAWebJS from "whatsapp-web.js";
import { Washima } from "../Washima/Washima";
import { WashimaMessage } from "../Washima/WashimaMessage";
import { Socket } from "socket.io";
import { NagaMessage } from "../Nagazap";
import { Archive } from "./Archive";
export type BoardPrisma = Prisma.BoardGetPayload<{}>;
export interface BoardForm {
    name: string;
}
export interface BoardWashimaSettings {
    washima_id: string;
    washima_name: string;
    unread_only: boolean;
    room_id?: string;
}
export interface BoardNagazapSettings {
    nagazap_id: string;
    nagazap_name: string;
    unread_only: boolean;
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
export interface TransferChatForm {
    chat_id: string;
    destination_board_id: string;
    destination_room_id: string;
    copy?: boolean;
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
    archive: Archive;
    static handleSocket(socket: Socket): void;
    static handleNagazapNewMessage(message: NagaMessage, company_id: string): Promise<void>;
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
        id: string;
        name: string;
        created_at: string;
        company_id: string;
        rooms: Prisma.JsonValue;
        washima_settings: Prisma.JsonValue;
        nagazap_settings: Prisma.JsonValue;
        archive: Prisma.JsonValue | null;
        entry_room_id: string;
    }>;
    saveRooms(): Promise<void>;
    newRoom(data: RoomForm): void;
    deleteRoom(room_id: string): void;
    updateRoom(updatedRoom: Room): void;
    newChat(chat: Chat, room_id?: string): Promise<void>;
    getWashimaSetting(washima_id?: string): BoardWashimaSettings | undefined;
    getNagazapSetting(nagazap_id?: string): BoardNagazapSettings | undefined;
    handleMessage(chatDto: ChatDto): Promise<false | undefined>;
    handleWashimaSettingsChange(data: BoardWashimaSettings[]): Promise<boolean>;
    unsyncWashima(data: BoardWashimaSettings): void;
    syncWashima(data: BoardWashimaSettings): Promise<void>;
    handleNagazapSettingsChange(data: BoardNagazapSettings[]): Promise<boolean>;
    unsyncNagazap(data: BoardNagazapSettings): void;
    syncNagazap(data: BoardNagazapSettings): Promise<void>;
    handleWashimaDelete(washima_id: string): false | undefined;
    emit(event?: string, data?: any): void;
    getAccess(): Promise<{
        users: User[];
        departments: Department[];
    }>;
    changeAccess(access: BoardAccess): Promise<void>;
    getDestinationBoard(board_id: string): Promise<Board>;
    getChatRoomIndex(chat_id: string): {
        room: number;
        chat: number;
    };
    getChatByPlatform(platform: "nagazap" | "washima", platform_id: string, plataform_chat_identifier: string): Chat | undefined;
    getChatByPhone(phone: string): Chat | undefined;
    getChatById(chat_id: string): Chat | undefined;
    removeChat(chat_id: string): void;
    transferChat(data: TransferChatForm): Promise<void>;
    getRoom(room_id: string): Room;
    addComment(chat_id: string, data: CommentForm): Promise<import("./Chat").Comment | undefined>;
    getChatComments(chat_id: string): import("./Chat").Comment[] | undefined;
    archiveChat(chat_id: string): Promise<void>;
    unarchiveChat(chat_id: string, room_id?: string): Promise<Chat | undefined>;
}
