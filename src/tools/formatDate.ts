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

export const monthName = (month: number) => {
    return months[month + 1] || "Mês inválido"
}
const weekDay = (day: 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
    return days[day]
}

const normalize = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export default { weekDay, normalize, monthName }
