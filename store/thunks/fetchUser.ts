import { createAsyncThunk } from "@reduxjs/toolkit";

const getUserListData = createAsyncThunk(
  "api/user/",
  async ({ skip, itemsPerPage }: any) => {
    const response = await fetch(
      `https://dummyjson.com/users?skip=${skip}&limit=${itemsPerPage}`
    );
    const responseData = await response.json();

    return responseData;
  }
);

export { getUserListData };
