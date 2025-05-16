export interface Chat {
    id: ContactId

    isGroup: boolean
    isMuted: boolean
    isReadOnly: boolean

    muteExpiration: number
    name: string
    pinned: boolean
    timestamp: number
    unreadCount: number

    lastMessage: Message
    groupMetadata?: Group

    profilePic?: string
    messages?: Message[]
}

export interface Message {
    id: {
        fromMe: boolean
        id: string
        remote: string
        _serialized: string
    }

    author?: string
    body: string
    from: string
    fromMe: boolean
    hasMedia: boolean
    timestamp: number
    to: string
    type: "ptt" | "video" | "image" | "text" | "sticker" | "revoked" | "call_log" | "e2e_notification" | "notification_template"
}

export interface Group {
    id: ContactId
    incognito: boolean
    owner: ContactId
    creation: number
    participants: Participant[]
    pastParticipants: PastParticipant[]
    subject: string
}

export interface ContactId {
    server: string
    user: string
    _serialized: string
}

export interface Participant {
    id: ContactId
    isAdmin: boolean
    isSuperAdmin: boolean
}

export interface PastParticipant {
    id: ContactId
    leaveReason: string
    leaveTs: number
}
