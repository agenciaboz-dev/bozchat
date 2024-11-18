export interface NotificationOptions {
    title: string
    body: string
    icon_url?: string
    onClick?: () => void
    audio_src?: string
}

export const useNotification = () => {
    const notify = (data: NotificationOptions) => {
        const notification = new Notification(data.title, {
            body: data.body,
            icon: data.icon_url,
        })

        notification.onclick = (ev) => {
            window.focus()
            if (window.parent) {
                window.parent.focus()
            }

            if (data.onClick) data.onClick()
        }

        if (data.audio_src) {
            const audio = new Audio(data.audio_src)
            audio.play()
        }
    }

    return notify
}
