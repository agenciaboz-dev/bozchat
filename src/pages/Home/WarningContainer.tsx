import React, { useEffect, useState } from "react"
import { Box, Chip, Pagination } from "@mui/material"
import { ContainerWrapper } from "./ContainerWrapper"
import { useWarnings } from "../../hooks/useWarnings"
import { useUser } from "../../hooks/useUser"
import { useNavigate } from "react-router-dom"
import { ContainerSkeleton } from "./ContainerSkeleton"

interface WarningContainerProps {
    customer?: boolean
}

export const WarningContainer: React.FC<WarningContainerProps> = ({ customer }) => {
    const navigate = useNavigate()
    const warnings = useWarnings()

    const [list, setList] = useState<Warning[]>(warnings.list.filter((item) => item.customerId == null))
    const [listCustomer, setListCustomer] = useState<Warning[]>(warnings.list.filter((item) => item.customer))

    const itemsPerPage = 4
    const [page, setPage] = useState(1)

    const noOfPages = Math.ceil(list.length / itemsPerPage)
    const noOfPagesCustomer = Math.ceil(listCustomer.length / itemsPerPage)

    const handleChangePage = (event: any, value: any) => {
        setPage(value)
    }

    useEffect(() => {
        setList(warnings.list)
    }, [warnings.list])

    return list ? (
        <ContainerWrapper>
            <Box sx={{ flexDirection: "column", width: 1, height: "100%", justifyContent: "space-between" }}>
                <Box
                    sx={{
                        flexDirection: "column",
                        width: 1,
                        height: "fit-content",
                        maxHeight: "90%",
                        justifyContent: "space-between",
                        gap: "0.8vw",
                    }}
                >
                    <Box
                        sx={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            overflowY: "hidden",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {customer ? "Avisos Cliente" : "Avisos"}
                        <p
                            style={{ fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => {
                                navigate("/warnings")
                            }}
                        >
                            Ver mais
                        </p>
                    </Box>
                    {!customer
                        ? list
                              .filter((item) => !item.customer)
                              .sort((a, b) => b.id - a.id)
                              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                              .map((warning) => (
                                  <Box sx={{ flexDirection: "column" }}>
                                      <Box
                                          sx={{
                                              alignItems: "center",
                                              width: 1,
                                              justifyContent: "space-between",
                                              color: "text.secondary",
                                          }}
                                      >
                                          <Box sx={{ flexDirection: "column", width: 0.7 }}>
                                              <p
                                                  style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "800",
                                                      maxWidth: "100%",
                                                      overflowX: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                  }}
                                              >
                                                  {warning.title}
                                              </p>
                                              <p
                                                  style={{
                                                      fontSize: "0.8rem",
                                                      maxWidth: "100%",
                                                      overflowX: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                  }}
                                              >
                                                  {warning.text}
                                              </p>
                                          </Box>
                                          <Box sx={{ flexDirection: "column", width: 0.25, textAlign: "end" }}>
                                              <p style={{ fontSize: "0.8rem" }}>{warning.creator.name.split(" ")[0]}</p>
                                              <p style={{ fontSize: "0.8rem" }}>
                                                  {new Date(Number(warning.date)).toLocaleString("pt-br")}
                                              </p>
                                          </Box>
                                      </Box>
                                  </Box>
                              ))
                        : listCustomer
                              .sort((a, b) => b.id - a.id)
                              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                              .map((warning) => (
                                  <Box sx={{ flexDirection: "column" }}>
                                      <Box
                                          sx={{
                                              alignItems: "center",
                                              width: 1,
                                              justifyContent: "space-between",
                                              color: "text.secondary",
                                          }}
                                      >
                                          <Box sx={{ flexDirection: "column", width: 0.7 }}>
                                              <p
                                                  style={{
                                                      fontSize: "1rem",
                                                      fontWeight: "800",
                                                      maxWidth: "100%",
                                                      overflowX: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                  }}
                                              >
                                                  {warning.title}{" "}
                                                  <Chip label={warning.customer.name} sx={{ fontSize: "0.7vw" }} />
                                              </p>
                                              <p
                                                  style={{
                                                      fontSize: "0.8rem",
                                                      maxWidth: "100%",
                                                      overflowX: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                  }}
                                              >
                                                  {warning.text}
                                              </p>
                                          </Box>
                                          <Box sx={{ flexDirection: "column", width: 0.25, textAlign: "end" }}>
                                              <p style={{ fontSize: "0.8rem" }}>{warning.creator.name.split(" ")[0]}</p>
                                              <p style={{ fontSize: "0.8rem" }}>
                                                  {new Date(Number(warning.date)).toLocaleString("pt-br")}
                                              </p>
                                          </Box>
                                      </Box>
                                  </Box>
                              ))}
                </Box>
                <Pagination
                    count={customer ? noOfPagesCustomer : noOfPages}
                    onChange={handleChangePage}
                    color="primary"
                    variant="outlined"
                    page={page}
                    sx={{ mt: 2, alignSelf: "center" }}
                />
            </Box>
            {/* {!customer && ( */}
            {/* )} */}
        </ContainerWrapper>
    ) : (
        <ContainerSkeleton />
    )
}
