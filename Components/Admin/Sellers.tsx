import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import SellersTable from "../Utils/Admin/SellersTable";
import { useAdminSellers } from "../../hooks/useDataFetch";
import { TAdminSeller } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
interface Iupdate {
  modal: {
    isUpdating: boolean;
  };
}
interface IAdminSeller {
  store: TAdminSeller,
  length: number,
  lastProducts: any,
}
const Sellers: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [currency, setCurrency] = useState<string>("$");
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const search = event.target.value;
      const newSearchValue = search.toLowerCase();
      const newSeller = data?.filter((seller: IAdminSeller) =>
        seller?.store?.name?.toLowerCase().includes(newSearchValue)
      );
      setSelllers(newSeller);
      setSearch(search);
    },
    [search]
  );
  const [sellers, setSelllers] = useState<IAdminSeller[]>([]);
  const [filterSellers, setFilterSelllers] = useState<IAdminSeller[]>([]);

  const searchFields = ['Name', 'Email', 'Phone', 'Country', 'Plan']

  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterSelllers(sellers)
    } else {
      let filter = sellers;
      if (searchOption.field === searchFields[0]) {
        filter = sellers.filter(s => s.store.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filter = sellers.filter(s => s.store.owner?.owner?.email?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[2]) {
        filter = sellers.filter(s => s.store.owner?.owner?.phone?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[3]) {
        filter = sellers.filter(s => s.store.owner?.owner?.country?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else {
        filter = sellers.filter(s => s.store.owner?.package?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterSelllers(filter)
    }
  }, [searchOption, sellers])

  const onSuccess = (data: IAdminSeller[]) => {
    setSelllers(data);
  };
  const { data, isFetching, isFetched, refetch } = useAdminSellers(onSuccess);
  useTokenRefetch(refetch)
  const isUpdating = useSelector((state: Iupdate) => state.modal.isUpdating);
  const handleRefetch = useCallback(() => {
    refetch();
  }, [isUpdating]);
  return (
    <>
      <Header
        title="Seller"
        searchFields={searchFields}
        totalAmount={sellers.length}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />
      <Card
        elevation={0}
        sx={{ background: "white", mt: 1, p: 2, minHeight: "90vh" }}
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
          {isFetched && filterSellers?.length > 0 && (
            <SellersTable handleRefetch={handleRefetch} sellers={filterSellers} />
          )}
        </Box>
      </Card>
    </>
  );
};
export default Sellers;
