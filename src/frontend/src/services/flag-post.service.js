import useSWR from 'swr';
import { mutate } from 'swr';
import api from 'utils/api';
import { fetcher } from './categories.service';

export const useFlagPosts = (page = 1, search = '', sort = 'desc', perPage = 10) => {
  const params = new URLSearchParams();
  if (page > 1) params.append('page', page);
  if (search) params.append('search', search);
  if (sort) params.append('sort', sort);
  if (perPage !== 10) params.append('per_page', perPage);

  const queryString = params.toString();
  const url = `/flag-posts${queryString ? `?${queryString}` : ''}`;

  const { data, error, mutate, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    flagPosts: data?.data,
    meta: data?.meta,
    error,
    mutate,
    isLoading,
  };
};

export const useFlagPostStatuses = () => {
  const { data, isLoading } = useSWR('/flag-posts/statuses', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    flagPostStatuses: data?.data,
    isLoading,
  };
};

export const updateFlagPostStatus = async (flagPostId, statusId) => {
  const response = await api.put(`/flag-posts/${flagPostId}`, { status_id: statusId });
  mutate((key) => key && key.startsWith('/flag-posts'));
  return response.data;
};
