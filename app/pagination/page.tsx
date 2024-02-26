"use client";
import InfiniteScroll from "@/components/infinite-scroll";
import Pagination from "@/components/pagination/pagination";
import { User } from "@/types/DummyJson";
import { useMediaQuery } from "react-responsive";
import React, { useCallback, useEffect, useRef, useState } from "react";
interface UsersResponse {
  limit: number;
  skip: number;
  total: number;
  users: User[];
}
const Page = () => {
  const [data, setData] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // const users: User[] = data.slice(skip, skip + itemsPerPage); 但會需要加skelton loading 改用state優勢會有資料暫存 缺點需要component re-render
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  });
  const itemsPerPage = isDesktop ? 5 : 8; // 每頁顯示的數據數
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 是否還有更多數據可以加載

  const isFirstRender = useRef(true); // for React reactStrictMode
  const fetchNewUsers = async (skip: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://dummyjson.com/users?skip=${skip}&limit=${itemsPerPage}`
      );
      const responseData: UsersResponse = await response.json();
      setData((prevUsers) => [...prevUsers, ...responseData.users]);
      setUsers(responseData.users);
      setTotalItems(responseData.total);
      if (responseData.users.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const skip = (currentPage - 1) * itemsPerPage;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!data[skip]) {
      fetchNewUsers(skip);
    } else {
      setUsers(data.slice(skip, skip + itemsPerPage));
    }
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const loadMore = useCallback(() => {
    const delay = 200;
    setLoading(true);
    if (hasMore && !loading) {
      const skip = data.length;
      const timeoutId = setTimeout(() => {
        fetchNewUsers(skip);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [loading, hasMore, data.length]);

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
          {users.map((user) => (
            <div key={user.id} className="bg-pink-900 p-4 rounded-md">
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <div className="grid sm:hidden">
        <div className="p-4 w-full gap-4 grid">
          {data.map((user) => (
            <div key={user.id} className="bg-pink-900 p-4 rounded-md">
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p>{user.email}</p>
            </div>
          ))}
          {!hasMore ? <div>has no more</div> : loading && <div>Loading...</div>}
          <InfiniteScroll loadMore={loadMore} />
        </div>
      </div>
    </div>
  );
};

export default Page;
