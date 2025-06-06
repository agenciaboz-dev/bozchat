import { WithoutFunctions } from "../helpers";
import { NagaMessage } from "../Nagazap";
import { WashimaGroupUpdate } from "../Washima/WashimaGroupUpdate";
import { WashimaMessage } from "../Washima/WashimaMessage";
export type ChatDto = WithoutFunctions<Chat>;
export declare class Chat {
    id: string;
    washima_id?: string;
    washima_chat_id?: string;
    nagazap_id?: string;
    name: string;
    phone: string;
    is_group?: boolean;
    profile_pic?: string;
    last_message: WashimaMessage | NagaMessage;
    unread_count: number;
    constructor(data: ChatDto);
    getMessages(): Promise<{
        messages: WashimaMessage[];
        group_updates: WashimaGroupUpdate[] | undefined;
    } | {
        messages: WashimaMessage[];
        group_updates?: undefined;
    } | undefined>;
}
