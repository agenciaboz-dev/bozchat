import { NagazapLinkClick } from "../../../types/server/class/NagazapLink"

export interface DateClick {
    date: string
    clicks: number
}

export const buildDetailedResult = (clicks: NagazapLinkClick[]) => {
    const initial_date = new Date(
        clicks.reduce(
            (older, click) => (click.timestamp < older ? click.timestamp : older),
            clicks.length > 0 ? clicks[0].timestamp : new Date().getTime()
        )
    )
    initial_date.setDate(initial_date.getDate() - 1)
    const days: DateClick[] = [{ date: initial_date.toLocaleDateString("pt-br"), clicks: 0 }]

    clicks.forEach((click) => {
        const date = new Date(click.timestamp).toLocaleDateString("pt-br")
        const index = days.findIndex((item) => item.date === date)
        if (index > -1) {
            days[index].clicks += 1
        } else {
            days.push({ date, clicks: 1 })
        }
    })

    return days
}
