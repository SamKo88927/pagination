import { createSlice } from "@reduxjs/toolkit";
import { getUserListData } from "../thunks/fetchUser";
import { DummyUsersResponse } from "@/types/DummyJson";

type UserState = {
  isUserLoading: boolean;
  userListData: any[];
  userListDataFetch: "init" | "success" | "error";
  userListHasMore: boolean;
};

const initialState: UserState = {
  isUserLoading: false,
  userListDataFetch: "init",
  userListData: [],
  userListHasMore: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserListData.pending, (state) => {
      state.isUserLoading = true;
    });
    builder.addCase(getUserListData.fulfilled, (state, action) => {
      state.isUserLoading = false;
      const { users, limit, skip, total }: DummyUsersResponse = action.payload;
      const uniqueUsers = users.filter((newUser) => {
        return !state.userListData.some(
          (existingUser) => existingUser.id === newUser.id
        );
      });
      state.userListData = [...state.userListData, ...uniqueUsers];
      if (users.length === 0) {
        state.userListHasMore = false;
      }
      state.userListDataFetch = "success";
    });
    builder.addCase(getUserListData.rejected, (state) => {
      state.isUserLoading = false;
      state.userListDataFetch = "error";
    });
  },
});

export const userReducer = userSlice.reducer;
