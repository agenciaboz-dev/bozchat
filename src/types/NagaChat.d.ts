import { NagaMessage } from "./server/class/Nagazap"

export interface NagaChat {
    name: string
    messages: NagaMessage[]
    from: string
    lastMessage: NagaMessage
}
