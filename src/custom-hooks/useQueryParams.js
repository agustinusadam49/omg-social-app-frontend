import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const useQueryParams = () => {
  const [query, setQuery] = useSearchParams();

  const useQueryObj = useMemo(() => {
    const setQueryParams = ({ key, value, encode = false }) => {
      setQuery(
        (prev) => {
          if (encode) {
            prev.set(key, encodeURIComponent(JSON.stringify(value)));
          } else {
            prev.set(key, value.toString());
          }
          return prev;
        },
        { replace: true }
      );
    };

    const getQueryParams = (params) => {
      if (typeof params === "string") {
        return query.get(params);
      } else {
        if (params.decode) {
          const value = query.get(params.key);
          // eslint-disable-next-line no-eval
          return value ? eval(decodeURIComponent(value)) : null;
        }
        return query.get(params.key);
      }
    };

    return {
      set: setQueryParams,
      get: getQueryParams,
      page: Number(query.get("page")),
      setPage: (newPage) => {
        setQueryParams({
          key: "page",
          value: `${newPage}`,
        });
      },
      pageSize: Number(query.get("pageSize")),
      setPageSize: (newPageSize) => {
        setQueryParams({
          key: "pageSize",
          value: `${newPageSize}`,
        });
      },
      search: query.get("search"),
      setSearch: (newSearch) => {
        setQueryParams({
          key: "search",
          value: newSearch,
        });
      },
      searchBy: query.get("searchBy"),
      setSearchBy: (newSearchBy) => {
        setQueryParams({
          key: "searchBy",
          value: newSearchBy,
        });
      },
    };
  }, [query, setQuery]);

  return useQueryObj;
};

export default useQueryParams;
