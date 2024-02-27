"use client";
import InfiniteScroll from "@/components/infinite-scroll";
import Pagination from "@/components/pagination/pagination";
import { User } from "@/types/DummyJson";
import { useMediaQuery } from "react-responsive";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, getUserListData } from "@/store";

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(100);
  const dispatch = useDispatch<AppDispatch>();
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  });
  const itemsPerPage = isDesktop ? 5 : 8; // 每頁顯示的數據數
  const [totalPages, setTotalPages] = useState(0);
  const { userListData, isUserLoading, userListHasMore } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    //解決useMediaQuery hydration問題
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [isDesktop]);

  const skip = (currentPage - 1) * itemsPerPage;
  const isFirstRender = useRef(true); // for React reactStrictMode
  useEffect(() => {
    //被動搜尋first time query
    if (isFirstRender.current) {
      dispatch(getUserListData({ skip, itemsPerPage }));
      isFirstRender.current = false;
    }
  }, []);

  const loadMore = useCallback(() => {
    const delay = 500;
    if (userListHasMore && !isUserLoading) {
      const skip = userListData.length;
      const timeoutId = setTimeout(() => {
        dispatch(getUserListData({ skip, itemsPerPage }));
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [userListHasMore, userListData.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const skip = (page - 1) * itemsPerPage;
    if (currentPage < page && !userListData[skip]) {
      dispatch(getUserListData({ skip, itemsPerPage }));
    }
  };
  useEffect(() => {
    if (userListData[skip]) {
      setUsers(userListData.slice(skip, skip + itemsPerPage));
    }
  }, [currentPage, userListData]);
  return (
    <div className="p-4">
      <h1 className="text-center font-bold text-xl">User List</h1>

      <div className="hidden sm:grid ">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div className="p-4 w-full gap-4 grid">
          {users?.map((user) => (
            <div key={user.id} className="bg-pink-900 p-4 rounded-md">
              <p>
                {user.id} {user.firstName} {user.lastName}
              </p>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:hidden">
        <div className="p-4 w-full gap-4 grid">
          {userListData.map((user) => (
            <div key={user.id} className="bg-pink-900 p-4 rounded-md">
              <p>
                {user.id} {user.firstName} {user.lastName}
              </p>
              <p>{user.email}</p>
            </div>
          ))}
          {!userListHasMore ? <div>Has no more</div> : <div>Loading...</div>}
          <InfiniteScroll loadMore={loadMore} />
        </div>
      </div>
    </div>
  );
};

export default Page;
