import React from "react"
import { Box, Chip } from "@mui/material"
import { ContainerWrapper } from "./ContainerWrapper"
import { useUser } from "../../hooks/useUser"
import { sortBirthday } from "../../tools/sortBirthday"
import { UserAvatar } from "../Admin/Stats/StatusLogs"
import birth from "../../assets/icons/birth.png"
import { ContainerSkeleton } from "./ContainerSkeleton"

interface BirthdayContainerProps {
    user: User
}

export const BirthdaysContainer: React.FC<BirthdayContainerProps> = ({ user }) => {
    const { list } = useUser()
    const next_birthdays = sortBirthday(list)
    // console.log(next_birthdays)

    return list ? (
        <ContainerWrapper>
            <Box sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>Aniversários</Box>
            <Box
                sx={{
                    flexDirection: "row",
                    gap: "0.5vw",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                <img
                    src={birth}
                    style={{
                        position: "absolute",
                        left: "-1.3vw",
                        top: "-1.3vw",
                        width: "2.5vw",
                        height: "2.5vw",
                        transform: "rotate(320deg)",
                        zIndex: 1,
                    }}
                />
                {next_birthdays.map((user, index) => {
                    const real_birthdate = new Date(user.birth)
                    real_birthdate.setDate(new Date(user.birth).getDate() + 1)
                    return (
                        <Box
                            sx={{
                                alignItems: "center",
                                justifyContent: "space-between",
                                fontWeight: index === 0 ? "bold" : "",
                                gap: "0.3vw",
                                zIndex: 0,
                            }}
                            key={user.id}
                        >
                            <UserAvatar user={user} />
                            <Box sx={{ fontSize: "0.7rem" }}>
                                <Chip
                                    label={real_birthdate.toLocaleDateString("pt-br", { day: "2-digit", month: "2-digit" })}
                                />
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </ContainerWrapper>
    ) : (
        <ContainerSkeleton />
    )
}
