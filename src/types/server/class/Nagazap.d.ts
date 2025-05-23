import { Prisma } from "@prisma/client";
import { OvenForm, WhatsappForm, WhatsappTemplateComponent } from "../types/shared/Meta/WhatsappBusiness/WhatsappForm";
import { UploadedFile } from "express-fileupload";
import { FailedMessageLog, SentMessageLog } from "../types/shared/Meta/WhatsappBusiness/Logs";
import { WithoutFunctions } from "./helpers";
import { BusinessInfo } from "../types/shared/Meta/WhatsappBusiness/BusinessInfo";
import { TemplateCategory, TemplateComponent, TemplateForm, TemplateInfo } from "../types/shared/Meta/WhatsappBusiness/TemplatesInfo";
import { Company } from "./Company";
import { Socket } from "socket.io";
import { NagazapLink } from "./NagazapLink";
export interface WhatsappListAction {
    button: string;
    sections: {
        title: string;
        rows: {
            id: string;
            title: string;
            description: string;
        }[];
    }[];
}
export interface WhastappButtonAction {
    buttons: {
        type: "reply";
        reply: {
            id: string;
            title: string;
        };
    }[];
}
export interface WhatsappInteractiveForm {
    type: "list" | "button";
    body: {
        text: string;
    };
    action: WhatsappListAction | WhastappButtonAction;
}
export type NagaMessageType = "text" | "reaction" | "sticker" | "image" | "audio" | "video" | "button" | "template" | "interactive";
export type NagaMessagePrisma = Prisma.NagazapMessageGetPayload<{}>;
export type NagaMessageTemplate = {
    name: string;
    language: {
        code: "en_US" | "pt_BR";
    };
    components?: WhatsappTemplateComponent[];
};
export type NagaMessageForm = Omit<Prisma.NagazapMessageGetPayload<{}>, "id" | "nagazap_id" | "template"> & {
    template?: NagaMessageTemplate;
    interactive?: WhatsappInteractiveForm;
};
export type NagaTemplatePrisma = Prisma.NagaTemplateGetPayload<{}>;
export declare const nagazap_include: {
    company: {
        include: {
            departments: {
                include: {
                    users: {
                        select: {
                            id: true;
                            name: true;
                        };
                    };
                };
            };
        };
    };
};
export type NagazapPrisma = Prisma.NagazapGetPayload<{
    include: typeof nagazap_include;
}>;
export interface NagazapMediaForm {
    url: string;
    type: "image" | "video" | "audio" | "document";
}
export interface NagazapResponseForm {
    number: string;
    text: string;
    media?: NagazapMediaForm;
    interactive?: WhatsappInteractiveForm;
    bot_name?: string;
}
interface BuildHeadersOptions {
    upload?: boolean;
}
export declare class NagaTemplate {
    id: string;
    created_at: number;
    last_update: number;
    sent: number;
    info: TemplateInfo;
    nagazap_id: string;
    static updateSentNumber(template_name: string, batch_size: number): Promise<NagaTemplate>;
    static getByName(name: string, nagazap_id?: string): Promise<NagaTemplate>;
    static getById(id: string): Promise<NagaTemplate>;
    static new(data: TemplateInfo, nagazap_id: string): Promise<NagaTemplate>;
    static update(data: Omit<Partial<NagaTemplate>, "info"> & {
        id: string;
        info?: Partial<TemplateInfo>;
    }): Promise<NagaTemplate>;
    constructor(data: NagaTemplatePrisma);
    load(data: NagaTemplatePrisma): void;
    update(data: Omit<Partial<NagaTemplate>, "info"> & {
        info?: Partial<TemplateInfo>;
    }): Promise<void>;
    convertWhatsappComponentsToTemplateInfo(formComponents: WhatsappTemplateComponent[]): TemplateInfo;
}
export declare class NagaMessage {
    id: number;
    from: string;
    timestamp: string;
    text: string;
    name: string;
    type: NagaMessageType;
    nagazap_id: string;
    template: TemplateInfo | null;
    from_bot: string | null;
    constructor(data: NagaMessagePrisma);
}
export interface NagazapForm {
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    companyId: string;
}
export interface NagaChat {
    name: string;
    messages: NagaMessage[];
    from: string;
    lastMessage: NagaMessage;
}
export interface BlacklistLog {
    timestamp: string;
    number: string;
    name?: string;
}
export declare class Nagazap {
    id: string;
    token: string;
    appId: string;
    phoneId: string;
    businessId: string;
    lastUpdated: string;
    stack: WhatsappForm[];
    blacklist: BlacklistLog[];
    frequency: string;
    batchSize: number;
    lastMessageTime: string;
    paused: boolean;
    sentMessages: SentMessageLog[];
    failedMessages: FailedMessageLog[];
    displayName: string | null;
    displayPhone: string | null;
    companyId: string;
    company: Company;
    blacklistTrigger: string;
    static initialize(): Promise<void>;
    static new(data: NagazapForm): Promise<Nagazap>;
    static getByBusinessId(business_id: string): Promise<Nagazap>;
    static getById(id: string): Promise<Nagazap>;
    static getByCompanyId(company_id: string): Promise<Nagazap[]>;
    static getAll(): Promise<Nagazap[]>;
    static shouldBake(): Promise<void>;
    static delete(id: string): Promise<{
        id: string;
        token: string;
        lastUpdated: string;
        appId: string;
        phoneId: string;
        businessId: string;
        stack: string;
        blacklist: string;
        frequency: string;
        batchSize: number;
        lastMessageTime: string;
        paused: boolean;
        sentMessages: string;
        failedMessages: string;
        blacklistTrigger: string;
        displayName: string | null;
        displayPhone: string | null;
        companyId: string;
    }>;
    static sendResponse(id: string, data: NagazapResponseForm, socket?: Socket): Promise<void>;
    constructor(data: NagazapPrisma);
    loadBlacklist(saved_list: any[]): BlacklistLog[];
    getConversations(messages?: NagaMessage[]): Promise<Map<string, NagaMessage[]>>;
    filterTemplatesOnlyMessages(conversations: Map<string, NagaMessage[]>): NagaMessage[];
    getMessages(from?: string): Promise<NagaMessage[]>;
    update(data: Partial<WithoutFunctions<Nagazap>>): Promise<this>;
    updateToken(token: string): Promise<void>;
    buildHeaders(options?: BuildHeadersOptions): {
        Authorization: string;
        "Content-Type": string;
    };
    getInfo(): Promise<BusinessInfo | undefined>;
    isMessageFromMe(message: NagaMessage): boolean;
    saveMessage(data: NagaMessageForm): Promise<NagaMessage>;
    addToBlacklist(number: string, name: string): Promise<void>;
    removeFromBlacklist(number: string): Promise<void>;
    getMetaTemplates(): Promise<TemplateInfo[]>;
    getMetaTemplate(template_id: string): Promise<TemplateInfo>;
    uploadMedia(file: UploadedFile, filepath: string): Promise<string>;
    sendMessage(message: WhatsappForm): Promise<void>;
    queueMessage(data: WhatsappForm): Promise<WhatsappForm[]>;
    queueBatch(data: WhatsappForm[]): Promise<WhatsappForm[]>;
    prepareBatch(data: OvenForm, image_id?: string, image_url?: string): Promise<void>;
    saveStack(): Promise<void>;
    bake(): Promise<void>;
    pause(): Promise<void>;
    start(): Promise<void>;
    clearOven(): Promise<void>;
    log(data: any, template_name: string): Promise<void>;
    errorLog(data: any, number: string): Promise<void>;
    createTemplate(data: TemplateForm): Promise<NagaTemplate>;
    updateTemplate(template_id: string, data: {
        components?: TemplateComponent[];
        category?: TemplateCategory;
    }): Promise<NagaTemplate>;
    getTemplateSheet(template_name: string, type?: string): string;
    exportTemplateModel(template: TemplateForm, type?: string): Promise<string>;
    uploadTemplateMedia(file: UploadedFile): Promise<any>;
    downloadMedia(media_id: string): Promise<string>;
    emit(): void;
    sendResponse(data: NagazapResponseForm, socket?: Socket): Promise<void>;
    getLinks(): Promise<NagazapLink[]>;
    newLink(url: string, template_name?: string): Promise<NagazapLink>;
    findOriginalLink(url: string): Promise<NagazapLink | undefined>;
    getTemplates(): Promise<NagaTemplate[]>;
    getTemplate(id: string): Promise<NagaTemplate>;
    getTemplateByName(name: string): Promise<NagaTemplate>;
    syncTemplates(): Promise<void>;
    deleteTemplate(template_id: string): Promise<NagaTemplate>;
    getLastTemplateSentToNumber(number: string): Promise<void>;
}
export {};
