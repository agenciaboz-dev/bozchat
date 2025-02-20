import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "../helpers";
import { Edge, Node, ReactFlowJsonObject } from "@xyflow/react";
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
export interface FlowNode extends Node {
    data: {
        onAddChild: (type: "message" | "response") => void;
        value: string;
        editNode: (node: FlowNode | null) => void;
        deleteNode?: (node: FlowNode) => void;
        getChildren: (parentId: string, type?: "direct" | "recursive") => FlowNode[];
    };
}
export interface FlowEdge extends Edge {
    type?: string;
    animated?: boolean;
}
export interface ActiveBot {
    chat_id: string;
    current_node_id: string;
    last_interaction: number;
    started_at: number;
}
export type BotForm = Omit<WithoutFunctions<Bot>, "id" | "created_at" | "triggered" | "instance" | "active_on">;
export declare class Bot {
    id: string;
    name: string;
    created_at: string;
    trigger: string;
    triggered: number;
    instance: ReactFlowJsonObject<Node, Edge>;
    active_on: ActiveBot[];
    company_id: string;
    nagazap_ids: string[];
    washima_ids: string[];
    static new(data: BotForm): Promise<Bot>;
    static getById(id: string): Promise<Bot>;
    static getByWashima(washima_id: string): Promise<Bot[]>;
    static getByNagazap(nagazap_id: string): Promise<Bot[]>;
    constructor(data: BotPrisma);
    load(data: BotPrisma): void;
    update(data: Partial<Bot>): Promise<void>;
    getChannels(): Promise<void>;
    delete(): Promise<void>;
    handleIncomingMessage(message: string, chat_id: string, response: (text: string) => void): void;
    getActiveChat(chat_id: string): ActiveBot | undefined;
    newChat(chat_id: string): ActiveBot;
}
export {};
