import { useState, useEffect } from "react";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";

export function usePaginatedQuery(
  queryKey: any[],
  fetchFn: (page: number) => Promise<any>
) {
  const queryClient = useQueryClient();

  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<
    "loading" | "loadingMore" | "success" | "error"
  >("loading");

  // detect when queryKey gets invalidated
  const isInvalidated = useIsFetching({ queryKey });

  // initial fetch
  useEffect(() => {
    loadFirstPage();
  }, []);

  // refetch when invalidated
  useEffect(() => {
    if (isInvalidated === 0) return;
    loadFirstPage();
  }, [isInvalidated]);

  const loadFirstPage = async () => {
    try {
      setStatus("loading");
      const res = await fetchFn(1);

      setResults(res.data);
      setPage(1);
      setTotalPages(res.pagination.totalPages);

      queryClient.setQueryData(queryKey, res.data);

      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  const loadMore = async () => {
    if (page >= totalPages) return;

    try {
      setStatus("loadingMore");

      const nextPage = page + 1;
      const res = await fetchFn(nextPage);

      setResults(prev => [...prev, ...res.data]);
      setPage(nextPage);

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return {
    results,
    status,
    loadMore,
    isLoadingMore: status === "loadingMore",
    canLoadMore: page < totalPages,
  };
}
