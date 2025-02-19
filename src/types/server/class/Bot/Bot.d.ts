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
export interface FlowResponse {
    flow: FlowObject[];
    trigger: string;
}
export interface FlowObject {
    type: "message" | "response";
    position: number[];
    message?: string;
    response?: FlowResponse[];
}
export interface ActiveBot {
    chat_id: string;
    flow_index: number;
    last_interaction: string;
    started_at: string;
    nagazap_id?: string;
    washima_is?: string;
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
    constructor(data: BotPrisma);
    load(data: BotPrisma): void;
    update(data: Partial<Bot>): Promise<void>;
    getChannels(): Promise<void>;
}
export {};
