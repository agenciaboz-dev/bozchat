import { NagaMessage } from "./server/class/Nagazap"

export interface NagaChat {
    messages: NagaMessage[]
    from: string
    lastMessage: NagaMessage
}
