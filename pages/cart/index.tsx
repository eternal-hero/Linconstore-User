import { NextPage } from "next";
import Cart from "../../Components/Cart/Index";
import {useContext, useEffect} from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
const CartPage: NextPage = () => {
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  const handleRefetchContext = useContext(ContextApi).handleRefetch;
  useEffect(() => {
    // const token : string = localStorage.getItem('token')
    const token : string = Cookies.get('token')
    if (!token)router.push("/");
    handleRefetchContext()
      }, [ router]);
  return <Cart />;
};
export default CartPage;
