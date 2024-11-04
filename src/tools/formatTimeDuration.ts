export function formatTimeDuration(duration: number) {
    let seconds = Math.floor(duration / 1000)
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60

    return `${minutes.toString().padStart(1, "0")}:${seconds.toString().padStart(2, "0")}`
}
