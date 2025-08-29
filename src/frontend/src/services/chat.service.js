import useSWR, { mutate } from 'swr';
import api from '../utils/api';
import { fetcher } from './categories.service';

const ChatService = {
  useChats: () => {
    const { data, error, isLoading, mutate } = useSWR('/chats', fetcher, {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

    return {
      chats: data?.data || [],
      error,
      isLoading,
      mutate,
    };
  },

  useChat: (chatId) => {
    const { data, error, isLoading, mutate } = useSWR(chatId ? `/chats/${chatId}` : null, fetcher, {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    });

    return {
      chat: data?.data,
      error,
      isLoading,
      mutate,
    };
  },

  useMessages: (chatId) => {
    const { data, error, isLoading, mutate } = useSWR(
      chatId ? `/chats/${chatId}/messages` : null,
      fetcher,
      {
        refreshInterval: 0,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }
    );

    return {
      messages: data?.data || [],
      error,
      isLoading,
      mutate,
    };
  },

  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },

  getChat: async (chatId) => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  getChatByPostAndEmployee: async (postId, employeeUserId) => {
    const response = await api.get(`/chats/by-post-employee`, {
      params: { post_id: postId, employee_user_id: employeeUserId },
    });
    return response.data;
  },

  createChat: async (postId, employeeUserId) => {
    const response = await api.post('/chats', {
      post_id: postId,
      employee_user_id: employeeUserId,
    });

    mutate(
      '/chats',
      (currentChats) => {
        if (!currentChats) return currentChats;
        const updatedChats = {
          ...currentChats,
          data: [response.data.data, ...currentChats.data],
        };
        return updatedChats;
      },
      false
    );

    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId, content, messageType = 'text') => {
    const response = await api.post(`/chats/${chatId}/messages`, {
      content,
      message_type: messageType,
    });

    const messageKey = `/chats/${chatId}/messages`;
    const chatKey = `/chats/${chatId}`;

    mutate(
      messageKey,
      (currentMessages) => {
        if (!currentMessages) return currentMessages;
        return {
          ...currentMessages,
          data: [...currentMessages.data, response.data.data],
        };
      },
      false
    );

    mutate(
      chatKey,
      (currentChat) => {
        if (!currentChat) return currentChat;
        return {
          ...currentChat,
          data: {
            ...currentChat.data,
            last_message_at: new Date().toISOString(),
            latest_message: response.data.data,
          },
        };
      },
      false
    );

    mutate(
      '/chats',
      (currentChats) => {
        if (!currentChats) return currentChats;
        const updatedChats = currentChats.data.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                last_message_at: new Date().toISOString(),
                latest_message: response.data.data,
                unread_count: chat.unread_count + 1,
              }
            : chat
        );
        const updatedChat = updatedChats.find((chat) => chat.id === chatId);
        const otherChats = updatedChats.filter((chat) => chat.id !== chatId);
        return {
          ...currentChats,
          data: [updatedChat, ...otherChats],
        };
      },
      false
    );

    return response.data;
  },

  listenToMessages: (chatId, callback) => {
    if (!window.Echo) {
      console.warn('Echo not available for listening to messages');
      return { stopListening: () => {} };
    }
    const channel = window.Echo.private(`chat.${chatId}`);

    channel.listen('message.sent', (e) => {
      const messageKey = `/chats/${chatId}/messages`;
      mutate(
        messageKey,
        (currentMessages) => {
          if (!currentMessages) return currentMessages;
          const messageExists = currentMessages.data.some((msg) => msg.id === e.message.id);
          if (messageExists) return currentMessages;

          return {
            ...currentMessages,
            data: [...currentMessages.data, e.message],
          };
        },
        false
      );

      const chatKey = `/chats/${chatId}`;
      mutate(
        chatKey,
        (currentChat) => {
          if (!currentChat) return currentChat;
          return {
            ...currentChat,
            data: {
              ...currentChat.data,
              last_message_at: e.message.created_at,
              latest_message: e.message,
            },
          };
        },
        false
      );

      mutate(
        '/chats',
        (currentChats) => {
          if (!currentChats) return currentChats;
          const updatedChats = currentChats.data.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  last_message_at: e.message.created_at,
                  latest_message: e.message,
                  unread_count: chat.unread_count + 1,
                }
              : chat
          );
          const updatedChat = updatedChats.find((chat) => chat.id === chatId);
          const otherChats = updatedChats.filter((chat) => chat.id !== chatId);
          return {
            ...currentChats,
            data: [updatedChat, ...otherChats],
          };
        },
        false
      );

      if (callback) callback(e.message);
    });

    return {
      stopListening: () => {
        channel.stopListening('message.sent');
      },
    };
  },

  listenToChatUpdates: (callback, userId) => {
    if (!window.Echo) {
      console.warn('Echo not available for listening to chat updates');
      return { stopListening: () => {} };
    }
    const channel = window.Echo.private(`user.${userId}`);

    channel.listen('ChatUpdated', (e) => {
      const chatKey = `/chats/${e.chat.id}`;
      mutate(
        chatKey,
        (currentChat) => {
          if (!currentChat) return currentChat;
          return {
            ...currentChat,
            data: e.chat,
          };
        },
        false
      );

      mutate(
        '/chats',
        (currentChats) => {
          if (!currentChats) return currentChats;
          const updatedChats = currentChats.data.map((chat) =>
            chat.id === e.chat.id ? e.chat : chat
          );
          return {
            ...currentChats,
            data: updatedChats,
          };
        },
        false
      );

      if (callback) callback(e.chat);
    });

    return {
      stopListening: () => {
        channel.stopListening('ChatUpdated');
      },
    };
  },

  listenToNewChats: (callback, userId) => {
    if (!window.Echo) {
      console.warn('Echo not available for listening to new chats');
      return { stopListening: () => {} };
    }
    const channel = window.Echo.private(`user.${userId}`);

    channel.listen('ChatCreated', (e) => {
      mutate(
        '/chats',
        (currentChats) => {
          if (!currentChats) return currentChats;
          return {
            ...currentChats,
            data: [e.chat, ...currentChats.data],
          };
        },
        false
      );

      if (callback) callback(e.chat);
    });

    return {
      stopListening: () => {
        channel.stopListening('ChatCreated');
      },
    };
  },

  updateMessage: async (chatId, messageId, content) => {
    const response = await api.put(`/chats/${chatId}/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  deleteMessage: async (chatId, messageId) => {
    const response = await api.delete(`/chats/${chatId}/messages/${messageId}`);
    return response.data;
  },

  closeChat: async (chatId) => {
    const response = await api.post(`/chats/${chatId}/close`);
    return response.data;
  },

  archiveChat: async (chatId) => {
    const response = await api.post(`/chats/${chatId}/archive`);
    return response.data;
  },

  reopenChat: async (chatId) => {
    const response = await api.post(`/chats/${chatId}/reopen`);
    return response.data;
  },
};

export default ChatService;
