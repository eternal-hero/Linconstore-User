import { GetServerSideProps } from "next";
import Brands from "../../Components/Brands/Brands";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import { TRating, TStoreId } from "../../Helpers/Types";
import React from "react";
import { capitalizeFirstLetter } from "../../Helpers/utils";

type TProducts = {
  discount: number;
  title: string;
  createdAt: string;
  photo: string[];
  condition: string;
  updatedAt: string;
  owner: TStoreId;
  price: number;
  quantity: number;
  ratingId: TRating;
  _id: string;
};
interface IProducts {
  products: TProducts[];
  image: string;
  name: string;
  description: string;
  sellerId: string;
  followers: number;
}
const BrandsPage: React.FC<IProducts> = ({
  products,
  image,
  description,
  name,
  sellerId,
  followers,
}) => {

  return (
    <Brands
      products={products}
      image={image}
      description={description}
      name={name}
      sellerId={sellerId}
      followers={followers}
    />
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  // const {id, pass} = context.params as unknown  as IReset;
  const slug: string | undefined | any = context.params?.slug;
  const store_name = capitalizeFirstLetter(slug);
  try {
    let response = await axios.get(`${baseUrl}/findstore?name=${store_name}`);
    const products = response.data.products;
    const image = response.data.image;
    const name = response.data.name;
    const sellerId = response.data.storeOwnerId;
    const description = response.data.description;
    const followers = response.data.followCount;

    return {
      props: {
        products,
        image,
        name,
        description,
        sellerId,
        followers,
      },
    };
  } catch (e) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
      props: {
        data: false,
      },
    };
  }
};
export default BrandsPage;
