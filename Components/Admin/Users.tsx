import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import UserTable from "../Utils/Admin/UserTable";
import { TAdminUser } from "../../Helpers/Types";
import { useGetAdminUsers } from "../../hooks/useDataFetch";
import { useTokenRefetch } from "../../hooks/useRefresh";
import Header, { SearchOptionType } from "./Header";

interface IAdminUsers {
  users: TAdminUser,
  no: number,
  lastOrders: any,
}
const Users: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const router = useRouter();

  const searchFields = ['name', 'phone', 'email', 'country']

  const [searchOption, setSearchOption] = useState<SearchOptionType>({
    field: searchFields[0],
    keyword: '',
  });

  const [users, setUsers] = useState<IAdminUsers[]>([]);
  const [filterUsers, setFilterUsers] = useState<IAdminUsers[]>([]);

  useEffect(() => {
    if (searchOption.keyword === '') {
      setFilterUsers(users)
    } else {
      let filter = users;
      if (searchOption.field === searchFields[0]) {
        filter = users.filter(u => (u.users.firstName + " " + u.users.lastName).toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else if (searchOption.field === searchFields[1]) {
        filter = users.filter(u => u.users.phone?.toString().includes(searchOption.keyword))
      } else if (searchOption.field === searchFields[2]) {
        filter = users.filter(u => u.users.email?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      } else {
        filter = users.filter(u => u.users.country?.toLocaleLowerCase().includes(searchOption.keyword.toLocaleLowerCase()))
      }
      setFilterUsers(filter)
    }
  }, [searchOption, users])

  const handleRefetch = useCallback(() => {
    refetch();
  }, []);
  const onSuccess = (data: IAdminUsers[]) => {
    setUsers(data);
  };
  const { isFetched, isFetching, refetch, data } = useGetAdminUsers(onSuccess);
  useTokenRefetch(refetch)
  return (
    <>
      <Header
        title="Users"
        searchFields={searchFields}
        totalAmount={(users.filter(user => user.users.isVerified)).length}
        searchOption={searchOption}
        setSearchOption={setSearchOption}
      />

      <Card
        elevation={0}
        sx={{ background: "white", mt: 1, p: 2, minHeight: "90vh" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {isMobile && (
            <ArrowBack onClick={() => router.back()} className={"pointer"} />
          )}
        </Box>
        <Box>
          {isFetching && <CircularProgress />}
          {isFetched && filterUsers.length > 0 && (
            <UserTable users={filterUsers} handleRefetch={handleRefetch} />
          )}
        </Box>
      </Card>
    </>
  );
};
export default Users;
