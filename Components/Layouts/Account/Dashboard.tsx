import * as React from "react";
import {useContext, useEffect} from "react";
import ContextApi from "../../../Store/context/ContextApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function DashboardContent({ children }: any) {
  
  const router = useRouter();
  const handleRefetchContext = useContext(ContextApi).handleRefetch;
  useEffect(() => {
    // const token : string = localStorage.getItem('token')
    const token : string = Cookies.get('token')
    if (!token)router.push("/");
    handleRefetchContext()
      }, [ router]);

  return (
    <>
      {children}
    </>
  );
}

export default function Dashboard({ children }: any) {
  return (
    <>
      <DashboardContent> {children} </DashboardContent>
    </>
  );
}
