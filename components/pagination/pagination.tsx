"use client";

interface PaginationProps {
  currentPage: number; // 當前頁碼
  totalPages: number; // 總頁數
  onPageChange: (page: number) => void; // 頁面變化時的回調函數
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex justify-end items-center space-x-4">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2  text-white rounded disabled:opacity-50"
      >
        &lt;
      </button>
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2  text-white rounded disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
