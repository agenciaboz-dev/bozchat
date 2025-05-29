import { Store } from "whatsapp-web.js";
interface Options {
    session: string;
}
export declare class PrismaRemoteAuthStore implements Store {
    sessionExists(options: Options): Promise<boolean>;
    save(options: Options): Promise<void>;
    extract(options: Options & {
        path: string;
    }): Promise<void>;
    delete(options: Options): Promise<void>;
    constructor();
}
export {};
