import React, { useCallback, useEffect, useState } from "react";
import { Card, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useFetchStores } from "../../hooks/useDataFetch";
import { TSellerStore } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import StoreTable from "../Utils/Admin/StoreTable";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
interface Iupdate {
    payout: {
        isUpdating: boolean
    }
}
interface IAdminPayout {
    seller: TSellerStore,
    length: number,
    balance: number
}

const Store: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const router = useRouter()
    const searchFields = ['store', 'email', 'balance']
    const [searchOption, setSearchOption] = useState<SearchOptionType>({
        field: searchFields[0],
        keyword: '',
    });
    const [stores, setStores] = useState<IAdminPayout[]>([]);
    const [filterStores, setFilterStores] = useState<IAdminPayout[]>([]);

    useEffect(() => {
        if (searchOption.keyword === '') {
            setFilterStores(stores)
        } else {
            let filter = stores;
            if (searchOption.field === searchFields[0]) {
                filter = stores.filter(s => s.seller.storeId?.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else if (searchOption.field === searchFields[1]) {
                filter = stores.filter(s => s.seller.owner?.email.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
            } else {
                filter = stores.filter(s => s.seller.storeId?.balance === Number(searchOption.keyword))
            }
            setFilterStores(filter)
        }
    }, [searchOption, stores])


    const onSuccess = (data: IAdminPayout[]) => {
        setStores(data)
    }
    const { data, isFetching, isFetched, refetch } = useFetchStores(onSuccess);
    useTokenRefetch(refetch)

    const isUpdating = useSelector((state: Iupdate) => state.payout.isUpdating);
    const handleRefetch = useCallback(() => {
        refetch()
    }, [isUpdating])
    return (
        <>
            <Header
                title="Payouts"
                searchOption={searchOption}
                searchFields={searchFields}
                setSearchOption={setSearchOption}
                totalAmount={stores.length}
            />
            <Card elevation={0} sx={{ background: 'white', mt: 1, p: 2, minHeight: '90vh' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    {isMobile && <ArrowBack onClick={() => router.back()} className={'pointer'} />}
                </Box>
                <Box>
                    {isFetching && <CircularProgress />}
                    {isFetched && filterStores?.length > 0 &&
                        <StoreTable handleRefetch={handleRefetch} stores={filterStores} />
                    }
                </Box>
            </Card>
        </>
    )
}
export default Store;