import useSWR from 'swr';
import api from 'utils/api';

export const fetcher = (url) => api.get(url).then(({ data }) => data);

export const useCategories = () => {
  const { data, error, mutate, isLoading } = useSWR('/categories', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    categories: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
};
