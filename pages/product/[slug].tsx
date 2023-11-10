import { GetServerSideProps } from "next";
import Product from "../../Components/Product/Index";
import axios from "axios";
import React from "react";
import { baseUrl } from "../../Helpers/baseUrl";
type TOwner = {
  name: string;
  owner: TSeller;
  logo: string;
  _id: string;
};
type TSeller = {
  name: string;
  _id: string;
};
type TProduct = {
  title: string;
  _id: string;
  description: string;
  price: number;
  owner: TOwner;
  weight: string;
  quantity: number;
  photo: string[];
  shippingDetail: string;
  instruction: string;
  condition: string;
  variants: any[];
};
type IReviews = {
  rate: number;
  name: string;
  description: string;
};
interface IProducts {
  products: TProduct;
  reviews: IReviews[];
}
const ProductPage: React.FC<IProducts> = ({ products, reviews }) => {
  return <Product data={products} reviews={reviews} />;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug: string | undefined | any = context.params?.slug;
  const productId = slug?.split("-");
  const length: number = productId.length;
  const id = productId[length - 1];
  try {
    const response = await axios(`${baseUrl}/product/${id}`);
    const response1 = await axios(`${baseUrl}/product/reviews/${id}`);
    const data1 = response1.data;
    const data = response.data;

    const reviewDatas = data1[0]?data1[0].ratings.map(data => ({
      rate: data.rating,
      name: data.name,
      description: data.comment?data.comment:""
    })):[]

    return {
      props: {
        products: data,
        reviews: reviewDatas,
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
export default ProductPage;
