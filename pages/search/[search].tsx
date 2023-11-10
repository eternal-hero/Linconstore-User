import { GetServerSideProps, NextPage } from "next";
import SearchResults from "../../Components/Search/Result";
import axios from "axios";
import { baseUrl } from "../../Helpers/baseUrl";
import React from "react";
import { TStoreId } from "../../Helpers/Types";
type TRating = {
  averageRating: number;
  ratings: [];
};
type TProducts = {
  title: string;
  price: number;
  updatedAt: string;
  discount: number;
  owner: TStoreId;
  photo: string[];
  condition: string;
  ratingId: TRating;
  quantity: number;
  _id: string;
};
type TAds = {
  productId: TProducts;
};
interface IResults {
  products: TProducts[];
  ads: TAds[];
  searchTags: string[];
  relatedProducts: TProducts[];
}
const Search: React.FC<IResults> = ({
  searchTags,
  relatedProducts,
  products,
  ads,
}) => {
  return (
    <SearchResults
      ads={ads}
      searchTags={searchTags}
      products={products}
      relatedProducts={relatedProducts}
    />
  );
};
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // @ts-ignore
  const search: string | undefined = params?.search;
  const searchString = search!.split("&");
  const term: string = searchString[0];
  const id: string = searchString[1].replace("category=", "");
  const tag: string = searchString[2].replace("tag=", "");
  const response = await axios.get(
    `${baseUrl}/search/product?term=${term}&id=${id}&tag=${tag}`
  );
  const data = response.data;
  return {
    props: {
      products: data.products,
      relatedProducts: data.relatedItem,
      ads: data.ads,
      searchTags: term,
    },
  };
};
export default Search;
