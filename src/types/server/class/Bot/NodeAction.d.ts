import { WithoutFunctions } from "../helpers";
import { BotMessageForm } from "./Bot";
export type ValidAction = "board:room:chat:new";
export type NodeActionDto = WithoutFunctions<NodeAction>;
export interface ActionSettings {
    misconfigured?: boolean;
    [key: string]: any;
}
export declare class NodeAction {
    target: ValidAction;
    settings: ActionSettings;
    static init(dto: NodeActionDto): NodeAction;
    constructor(data: NodeActionDto);
    run(data: BotMessageForm): Promise<void>;
}
