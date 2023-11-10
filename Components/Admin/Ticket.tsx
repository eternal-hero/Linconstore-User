import React, { useCallback, useEffect, useState } from "react";
import {
    Card,
    CircularProgress,
    useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFetchAllContacts } from "../../hooks/useDataFetch";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import { reCreateDate } from "../../Helpers/getDate";
import TicketTable from "../Utils/Admin/TicketTable";
import { TRefunds } from "../../Helpers/Types";

const Ticket: React.FC = () => {

    const isMobile = useMediaQuery("(max-width: 600px)");
    const router = useRouter();

    const searchFields = ['ID', 'Name', 'Email', 'Mobile']

    const [searchOption, setSearchOption] = useState<SearchOptionType>({
        field: searchFields[0],
        keyword: '',
    });

    const [dateChange, setDateChange] = useState();
    const [tickets, setTickets] = useState<any>([]);
    const [filterTickets, setFilterTickets] = useState<any>([]);

    useEffect(() => {
        if (searchOption.keyword === '') {
            let filter = tickets;
            if (dateChange) {
                const tt = new Date(dateChange)
                filter = tickets.filter(s => reCreateDate(s?.createdAt) === reCreateDate(tt))
            }
            setFilterTickets(filter)

        } else {
            let filter = tickets;
            if (searchOption.field === searchFields[0]) {
                filter = tickets.filter(s => s._id.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[1]) {
                filter = tickets.filter(s => s.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[2]) {
                filter = tickets.filter(s => s.email?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[3]) {
                filter = tickets.filter(s => s.phone?.toString().includes(searchOption.keyword))
            }

            if (dateChange) {
                const tt = new Date(dateChange)
                filter = filter.filter(s => reCreateDate(s?.createdAt) === reCreateDate(tt))
            }
            setFilterTickets(filter)
        }
    }, [searchOption, tickets, dateChange])

    const onSuccess = (data: TRefunds[]) => {   //TODO need to update type
        setTickets(data)
    }

    const { refetch, isFetched, isFetching, data: ordersData } = useFetchAllContacts(onSuccess); //TODO need to update fetch function
    useTokenRefetch(refetch)

    const handleRefetch = useCallback(() => {
        refetch();
    }, []);
    return (
        <>
            <Header
                title="Tickets"
                searchFields={searchFields}
                searchOption={searchOption}
                calendar
                setSearchOption={setSearchOption}
                setDateChange={setDateChange}
            />
            <Card
                elevation={0}
                sx={{ background: "white", mt: 1, px: 2, minHeight: "90vh" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    {isMobile && (
                        <ArrowBack onClick={() => router.back()} className={"pointer"} />
                    )}
                </Box>
                <Box>
                    {isFetching && <CircularProgress />}
                    {isFetched && filterTickets.length > 0 && (
                        <TicketTable tickets={filterTickets} handleRefetch={handleRefetch} />
                    )}
                </Box>
            </Card>
        </>
    );
};
export default Ticket;
