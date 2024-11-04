export const sortBirthday = (users: User[]) => {
    const today = new Date()
    const year = today.getFullYear()

    const next_birthdays = users.sort((a, b) => {
        const birth_a = new Date(a.birth)
        const birth_b = new Date(b.birth)

        birth_a.setFullYear(year)
        birth_b.setFullYear(year)

        if (birth_a < today) birth_a.setFullYear(year + 1)
        if (birth_b < today) birth_b.setFullYear(year + 1)

        return birth_a.getTime() - birth_b.getTime()
    })
    console.log(next_birthdays)

    return next_birthdays
}
