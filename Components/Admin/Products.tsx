import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import ProductTable from "../Utils/Admin/ProductTable";
import { IAdminProducts } from "../../Helpers/Types";
import { useFetchProductForAdmin } from "../../hooks/useDataFetch";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";

const Products: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();

  const searchFields = ['store', 'name', 'category']

  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });
  const [products, setProducts] = useState<IAdminProducts[]>([]);
  const [filterProducts, setFilterProducts] = useState<IAdminProducts[]>([]);

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterProducts(products)
    } else {
      let filter = products;
      if (searchOption.field === searchFields[0]) {
        filter = products.filter(p => p.owner.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filter = products.filter(p => p.title.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else {
        filter = products.filter(p => p.category.title.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterProducts(filter)
    }
  }, [searchOption, products])
  const onSuccess = (data: IAdminProducts[]) => {
    setProducts(data);
  };
  const { isLoading, isFetched, isFetching, data, refetch } =
    useFetchProductForAdmin(onSuccess);

  useTokenRefetch(refetch)
  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  return (
    <>
      <Header
        title="Products"
        searchFields={searchFields}
        totalAmount={(products.filter(product => product.publish)).length}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
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
          {isFetched && filterProducts.length > 0 && (
            <ProductTable handleRefetch={handleRefetch} products={filterProducts} />
          )}
        </Box>
      </Card>
    </>
  );
};
export default Products;
