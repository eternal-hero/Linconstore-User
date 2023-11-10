import { GetServerSideProps } from "next";
import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ConfirmPassword from "../../Components/Auth/ConfirmPassword";
import {baseUrl} from "../../Helpers/baseUrl";
import Cookies from "js-cookie";

type Idata = {
  data: boolean;
  id: string;
};
const UserReset: React.FC<Idata> = ({ data, id }) => {
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.push("/");
    }
    // const isLoggedIn = localStorage.getItem('token');
    const isLoggedIn = Cookies.get('token');
    if (!!isLoggedIn){
      router.push("/")
    }
  }, [data, router]);
  return <ConfirmPassword id={id} />;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const {id, pass} = context.params as unknown  as IReset;
  const { id, pass } = context.query;
  try {
    const response = await axios.get(
      `${baseUrl}/user/reset/verify?id=${id}&otp=${pass}`
    );
    const data = response.data;
    return {
      props: {
        data: true,
        id,
      },
    };
  } catch (e) {
    return {
      props: {
        data: false,
      },
    };
  }
};
export default UserReset;
