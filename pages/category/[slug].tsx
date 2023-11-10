import { GetServerSideProps } from "next";
import Category from "../../Components/Category/Category";
import axios from "axios";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { baseUrl } from "../../Helpers/baseUrl";
type TCategory = {
  title: string;
  link: string;
  subcategories: string[];
};
type TCat = {
  category: TCategory;
  products: [];
};
interface ICat {
  data: TCat;
}
const CategoryPage: React.FC<ICat> = ({ data }) => {
  const router = useRouter();

  useEffect(() => {
    if (!data) {
      router.back();
    }
  }, [data, router]);
  return <Category data={data} />;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const {id, pass} = context.params as unknown  as IReset;
  const slug: string | undefined | any = context.params?.slug;
  const letter: string | undefined | any = context.query?.letter;

  const productId = slug?.split("-");
  const length: number = productId.length;
  const id = productId[length - 1];
  try {
    const response = await axios.get(`${baseUrl}/category/${id}`);

    const data = response.data;
  
    return {
      props: {
        data,
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
};

export default CategoryPage;
