import { NextPage } from "next";
import StoreExpense from "../../Components/Seller/StoreExpense";
import Dashboard from "../../Components/Layouts/Seller/Dashboard";

const Expenses: NextPage = () => {
  return (
    <Dashboard>
      <StoreExpense />
    </Dashboard>
  );
};
export default Expenses;
