import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import api from 'utils/api';
import { fetcher } from './categories.service';

export const usePosts = (page = 1, search = '', categoryId = '', sort = 'desc', perPage = 10) => {
  const params = new URLSearchParams();
  if (page > 1) params.append('page', page);
  if (search) params.append('search', search);
  if (categoryId) params.append('category_id', categoryId);
  if (sort) params.append('sort', sort);
  if (perPage !== 10) params.append('per_page', perPage);

  const queryString = params.toString();
  const url = `/posts${queryString ? `?${queryString}` : ''}`;

  const { data, error, mutate, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  return {
    posts: data?.data,
    meta: data?.meta,
    error,
    mutate,
    isLoading,
  };
};

export const createPost = async (data) => {
  try {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('body', data.body);
    formData.append('category_id', data.category_id);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    mutate((key) => key && key.startsWith('/posts'));
    mutate('/posts/trending-topics');
    toast('Post created successfully!', { type: 'success' });
    return response.data;
  } catch (error) {
    toast('Failed to create post. Please try again.', { type: 'error' });
    throw error;
  }
};

export const updatePost = async (id, data) => {
  try {
    const formData = new FormData();

    if (data.title) formData.append('title', data.title);
    if (data.body) formData.append('body', data.body);
    if (data.category_id) formData.append('category_id', data.category_id);
    if (data.status) formData.append('status', data.status);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
      });
    }

    if (data.removeAttachments && data.removeAttachments.length > 0) {
      data.removeAttachments.forEach((attachmentId, index) => {
        formData.append(`remove_attachments[${index}]`, attachmentId);
      });
    }

    formData.append('_method', 'PUT');

    const response = await api.post(`/posts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    mutate((key) => key && key.startsWith('/posts'));
    mutate('/posts/trending-topics');
    toast('Post updated successfully!', { type: 'success' });
    return response.data;
  } catch (error) {
    toast('Failed to update post. Please try again.', { type: 'error' });
    throw error;
  }
};

export const useDeletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    mutate((key) => key && key.startsWith('/posts'));
    toast('Post deleted successfully!', { type: 'success' });
    return response.data;
  } catch (error) {
    toast('Failed to delete post. Please try again.', { type: 'error' });
    throw error;
  }
};

export const useUpvotePost = async (id) => {
  const response = await api.post(`/posts/${id}/upvote`);
  mutate((key) => key && key.startsWith('/posts'));
  mutate('/posts/trending-topics');
  return response.data;
};

export const useFlagPost = async (id) => {
  const response = await api.post(`/posts/${id}/flag`);
  mutate((key) => key && key.startsWith('/posts'));
  return response.data;
};

export const trackPostView = async (id) => {
  try {
    const response = await api.post(`/posts/${id}/view`);
    mutate((key) => key && key.startsWith('/posts'));
    return response.data;
  } catch (error) {
    console.warn('Failed to track post view:', error);
    return null;
  }
};

export const useTrendingTopics = () => {
  const { data, error, mutate, isLoading } = useSWR('/posts/trending-topics', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 60000,
  });
  return {
    trendingTopics: data?.data || [],
    error,
    mutate,
    isLoading,
  };
};

export const useRecentActivities = () => {
  const { data, error, mutate, isLoading } = useSWR('/posts/recent-activities', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000,
  });
  return {
    recentActivities: data?.data || [],
    error,
    mutate,
    isLoading,
  };
};
