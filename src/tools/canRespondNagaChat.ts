import { NagaChat, Nagazap } from "../types/server/class/Nagazap"

export const canRespondNagaChat = (chat: NagaChat, nagazap: Nagazap) => {
    const now = new Date()
    console.log(now.getTime())
    const last_message = chat.messages.find((message) => message.name !== nagazap.displayPhone)
    console.log(last_message)
    if (!last_message) return false
    const message_time = Number(last_message.timestamp)

    const difference = now.getTime() - message_time

    console.log(difference)

    return difference <= 24 * 60 * 60 * 1000
}
