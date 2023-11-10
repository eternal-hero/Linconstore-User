import { NextPage } from "next";
import CancellationRefund from "../../Components/CancellationRefund/Index";
import {useContext, useEffect} from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const CancellationRefundPage: NextPage = () => {
  const router = useRouter();
  const handleRefetchContext = useContext(ContextApi).handleRefetch;
  // useEffect(() => {
  //   // const token : string = localStorage.getItem('token')
  //   const token : string = Cookies.get('token')
  //   if (!token)router.push("/");
  //   handleRefetchContext()
  //     }, [ router]);
  return <CancellationRefund />;
};

export default CancellationRefundPage;
