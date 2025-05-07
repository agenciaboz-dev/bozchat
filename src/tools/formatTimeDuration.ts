export function formatTimeDuration(duration: number) {
    let seconds = Math.floor(duration / 1000)
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60

    return `${minutes.toString().padStart(1, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function formatDurationMaxInteger(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    if (hours > 0) {
        return `${hours} ${hours === 1 ? "hora" : "horas"}`
    }

    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    }

    return `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`
}