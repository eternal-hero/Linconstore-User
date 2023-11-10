import React, { useCallback, useState } from "react";
import {
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useAdminReports } from "../../hooks/useDataFetch";
import { TAdminSeller } from "../../Helpers/Types";
import { useSelector } from "react-redux";
import { useTokenRefetch } from "../../hooks/useRefresh";
import ReportTable from "../Utils/Admin/ReportTable";
interface Iupdate {
  modal: {
    isUpdating: boolean;
  };
}
interface IAdminSeller {
  store: TAdminSeller,
  length: number
}
const Report: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();
  const [reports, setReports] = useState<IAdminSeller[]>([]);
  const onSuccess = (data: IAdminSeller[]) => {
    setReports(data);
  };
  const { data, isFetching, isFetched, refetch } = useAdminReports(onSuccess);
  useTokenRefetch(refetch)
  const isUpdating = useSelector((state: Iupdate) => state.modal.isUpdating);
  const handleRefetch = useCallback(() => {
    refetch();
  }, [isUpdating]);
  return (
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
        {isFetched && reports?.length > 0 && (
          <ReportTable handleRefetch={handleRefetch} reports={reports} />
        )}
      </Box>
    </Card>
  );
};
export default Report;
