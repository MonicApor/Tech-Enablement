import { mutate } from 'swr';
import api from 'utils/api';

// export const useComments = (postId) => {
//   const { data, error, mutate, isLoading } = useSWR(`/posts/${postId}/comments`, fetcher, {
//     revalidateOnFocus: false,
//     revalidateOnReconnect: true,
//   });

//   return {
//     comments: data?.data,
//     error,
//     mutate,
//     isLoading,
//   };
// };

export const createComment = async (body, postId, parentId = null) => {
  const response = await api.post(`/comments`, {
    body,
    post_id: postId,
    parent_id: parentId,
  });
  mutate((key) => key && key.startsWith('/posts'));
  mutate('/posts/trending-topics');
  return response.data;
};

export const updateComment = async (id, data) => {
  const response = await api.put(`/comments/${id}`, data);
  mutate((key) => key && key.startsWith('/posts'));
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await api.delete(`/comments/${id}`);
  mutate((key) => key && key.startsWith('/posts'));
  return response.data;
};
