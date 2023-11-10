import { NextPage } from "next";
import Wishlist from "../../Components/Wishlist/Index";
import { useContext, useEffect } from "react";
import ContextApi from "../../Store/context/ContextApi";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const WishlistPage: NextPage = () => {
  const isLoggedIn = useContext(ContextApi).isLoggedIn;
  const router = useRouter();
  useEffect(() => {
   // const token = localStorage.getItem('token')
    const token = Cookies.get('token')
    if(!token) router.push('/login')
  }, [router]);
  return <Wishlist />;
};
export default WishlistPage;
