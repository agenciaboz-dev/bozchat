import { Socket } from "socket.io";
import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
export declare const initializeIoServer: (server: HttpServer | HttpsServer) => void;
export declare const getIoInstance: () => SocketIoServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const handleSocket: (socket: Socket) => void;
