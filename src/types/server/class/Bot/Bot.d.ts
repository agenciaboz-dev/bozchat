import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "../helpers";
import { WashimaMediaForm } from "../Washima/Washima";
import { Edge, Node, ReactFlowJsonObject } from "@xyflow/react";
import { NagazapMediaForm } from "../Nagazap";
import { NodeAction } from "./NodeAction";
export declare const bot_include: {
    washimas: {
        select: {
            id: true;
        };
    };
    nagazaps: {
        select: {
            id: true;
        };
    };
};
type BotPrisma = Prisma.BotGetPayload<{
    include: typeof bot_include;
}>;
export interface FlowNodeData {
    [key: string]: any;
    onAddChild: (type: "message" | "response") => void;
    value: string;
    editNode: (node: FlowNode | null) => void;
    deleteNode?: (node: FlowNode) => void;
    getChildren: (parentId: string, type?: "direct" | "recursive") => FlowNode[];
    media?: {
        url: string;
        mimetype: string;
        type: "audio" | "image" | "video" | "document";
        name: string;
        base64?: string;
    };
    actions?: NodeAction[];
}
export interface FlowNode extends Node {
    data: FlowNodeData;
}
export interface FlowEdge extends Edge {
    type?: string;
    animated?: boolean;
}
export declare class ActiveBot {
    chat_id: string;
    current_node_id: string;
    last_interaction: number;
    started_at: number;
    constructor(data: WithoutFunctions<ActiveBot>);
}
export type BotForm = Omit<WithoutFunctions<Bot>, "id" | "created_at" | "triggered" | "instance" | "active_on">;
export interface PendingResponse {
    response: (text: string) => Promise<void>;
    timestamp: number;
    chat_id: string;
    bot: Bot;
}
export interface BotMessageForm {
    message: string;
    chat_id: string;
    response: (text: string, media?: WashimaMediaForm | NagazapMediaForm) => Promise<void>;
    other_bots: Bot[];
    platform: "nagazap" | "washima";
    platform_id: string;
}
export declare class Bot {
    id: string;
    name: string;
    created_at: string;
    trigger: string;
    triggered: number;
    instance: ReactFlowJsonObject<FlowNode, FlowEdge>;
    active_on: ActiveBot[];
    company_id: string;
    nagazap_ids: string[];
    washima_ids: string[];
    expiry_minutes: number;
    fuzzy_threshold: number;
    static pending_response: Map<string, PendingResponse>;
    static expiry_interval: NodeJS.Timeout;
    static new(data: BotForm): Promise<Bot>;
    static getById(id: string): Promise<Bot>;
    static getByWashima(washima_id: string): Promise<Bot[]>;
    static getByNagazap(nagazap_id: string): Promise<Bot[]>;
    static checkForExpiredChats(): Promise<void>;
    constructor(data: BotPrisma);
    load(data: BotPrisma): void;
    update(data: Partial<Bot>): Promise<void>;
    getChannels(): Promise<void>;
    delete(): Promise<void>;
    handleIncomingMessage(data: BotMessageForm): Promise<void>;
    getActiveChat(chat_id: string, incoming_message?: string): ActiveBot | undefined;
    newChat(chat_id: string): ActiveBot | undefined;
    getNodeChildren(nodeId: string, type?: "direct" | "recursive"): FlowNode[];
    getAnsweredNode(node_id: string, incoming_message: string): FlowNode | undefined;
    advanceChat(chat: ActiveBot, incoming_message: string): FlowNodeData[] | {
        value: string;
        media: undefined;
        actions: undefined;
    }[];
    getNextNode(node_id: string): FlowNode | undefined;
    save(): Promise<void>;
    closeChat(chat_id: string): void;
    normalize(text: string): string;
    compareIncomingMessage(message: string, trigger?: string): string | undefined;
    handleBoardDelete(board_id: string): void;
}
export {};
