import { NextPage } from "next";
import PostItem from "../../Components/Seller/create";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const Post: NextPage = () => {
  return (
    <Dashboard>
      <PostItem />
    </Dashboard>
  );
};
export default Post;
