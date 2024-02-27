"use client";
import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  loadMore: () => void;
}

const InfiniteScroll = ({ loadMore }: InfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    },
    [loadMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  return <div ref={loaderRef} className="h-10"></div>;
};

export default InfiniteScroll;
