// const months = {
//     [1]: "Jan",
//     [2]: "Fev",
//     [3]: "Mar",
//     [4]: "Abr",
//     [5]: "Mai",
//     [6]: "Jun",
//     [7]: "Jul",
//     [8]: "Ago",
//     [9]: "Set",
//     [10]: "Out",
//     [11]: "Nov",
//     [12]: "Dez",
// }

const months: { [key: number]: string } = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
}

const days = {
    [1]: "Dom",
    [2]: "Seg",
    [3]: "Ter",
    [4]: "Qua",
    [5]: "Qui",
    [6]: "Sex",
    [7]: "Sáb",
}

const long_days = {
    [1]: "Domingo",
    [2]: "Segunda",
    [3]: "Terça",
    [4]: "Quarta",
    [5]: "Quinta",
    [6]: "Sexta",
    [7]: "Sábado",
}

export const monthName = (month: number) => {
    return months[month + 1] || "Mês inválido"
}
const weekDay = (day: number, long?: boolean) => {
    return long ? long_days[day as keyof typeof long_days] : days[day as keyof typeof days]
}

const normalize = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default { weekDay, normalize, monthName }
