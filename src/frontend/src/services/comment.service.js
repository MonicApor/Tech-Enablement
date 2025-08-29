import useSWR, { mutate } from 'swr';
import api from 'utils/api';
import { fetcher } from './categories.service';

export const useComments = (postId) => {
  const { data, error, mutate, isLoading } = useSWR(`/posts/${postId}/comments`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    comments: data?.data,
    error,
    mutate,
    isLoading,
  };
};

export const useCreateComment = async (body, postId, parentId = null) => {
  const response = await api.post(`/comments`, {
    body,
    post_id: postId,
    parent_id: parentId,
  });
  mutate((key) => key && key.startsWith('/posts'));
  return response.data;
};

export const useUpdateComment = async (id, data, postId) => {
  const response = await api.put(`/comments/${id}`, data);
  mutate(`/posts/${postId}/comments`);
  return response.data;
};

export const useDeleteComment = async (id, postId) => {
  const response = await api.delete(`/comments/${id}`);
  mutate(`/posts/${postId}/comments`);
  return response.data;
};
