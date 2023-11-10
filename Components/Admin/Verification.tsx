import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Card,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import VerificationTable from "../Utils/Admin/VerificationTable";
import { a11yProps, TabPanel } from "../Utils/TabsPanel";
import ReviewTable from "../Utils/Admin/ReviewTable";
import { useFetchStores } from "../../hooks/useDataFetch";
import { TSellerStore } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";
import ContextApi from "../../Store/context/ContextApi";

interface modal {
  modal: {
    isUpdating: boolean;
    requestModal: boolean
  };
}
interface IVerify {
  balance: number,
  seller: TSellerStore
}
let isFirst = false

const Verification: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const searchFields = ['Name', 'Account Type', 'Country']

  const [requests, setRequests] = useState<IVerify[]>([]);
  const [reviews, setReviews] = useState<IVerify[]>([]);
  const [filterRequests, setFilterRequests] = useState<IVerify[]>([]);
  const [filterReviews, setFilterReviews] = useState<IVerify[]>([]);


  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterRequests(requests)
      setFilterReviews(reviews)
    } else {
      let filRev = reviews;
      let filReq = requests;
      if (searchOption.field === searchFields[0]) {
        filReq = requests.filter(s => s.seller.storeId?.name.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filReq = requests.filter(s => s.seller.account.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[2]) {
        filReq = requests.filter(s => s.seller.location.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterReviews(filRev)
      setFilterRequests(filReq)
    }
  }, [searchOption, reviews, requests])

  const [value, setValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onSuccess = (data: IVerify[]) => {
    const reviews = data.filter(x => !x.seller.isActive)
    setReviews(reviews)
    setRequests(data);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      isFirst = true
    }, 300)

    return () => clearTimeout(timeout)
  }, [])
  const { isFetched, isFetching, data, refetch } = useFetchStores(onSuccess);
  useTokenRefetch(refetch)
  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  const open: boolean = useSelector((state: modal) => state.modal.requestModal);
  const seller: any = useContext(ContextApi).sellerId;

  useEffect(() => {
    if (!open && seller) {
      let newReq = requests
      const targetPerson: any = newReq.find((item: any) => item._id === seller._id);
      if (targetPerson) {
        targetPerson.isActive = seller.isActive;
      }
      const newRev = newReq.filter(x => !x.seller.isActive)
      setReviews(newRev)
      setRequests(newReq);
    }
  }, [seller, open])

  return (
    <>
      <Header
        title="Verify"
        searchFields={searchFields}
        totalAmount={filterRequests.length}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />
      <Card
        elevation={0}
        sx={{ background: "white", mt: 1, minHeight: "90vh" }}
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
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { background: "var(--primary)" } }}
            aria-label="tabs "
          >
            <Tab
              sx={{
                minWidth: "50%",
                backgroundColor: value === 0 ? "var(--primary)" : "black",
                color: "#fff !important",
              }}
              label="Request"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                minWidth: "50%",
                backgroundColor: value === 1 ? "var(--primary)" : "black",
                color: "#fff !important",
              }}
              label="Review"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        {isFetched && filterRequests?.length === 0 && (
          <Typography variant={"h6"} textAlign={"center"}>
            {" "}
            Such Empty!{" "}
          </Typography>
        )}
        {isFetching && (
          <Typography variant={"h6"} textAlign={"center"}>
            {" "}
            <CircularProgress />{" "}
          </Typography>
        )}

        <Box sx={{ width: "100%" }}>
          <TabPanel value={value} index={0}>
            {isFetched && filterRequests?.length > 0 && (
              <VerificationTable
                requests={filterRequests}
                handleRefetch={handleRefetch}
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {isFetched && filterReviews?.length > 0 && (
              <ReviewTable reviews={filterReviews} handleRefetch={handleRefetch} />
            )}
          </TabPanel>
        </Box>
      </Card>
    </>
  );
};
export default Verification;
