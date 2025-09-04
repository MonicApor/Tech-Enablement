import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import useWebSocket from '../../../hooks/useWebSocket';
import ChatService from '../../../services/chat.service';

const Chats = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [urlParamsProcessed, setUrlParamsProcessed] = useState(false);
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.profile.user);
  useWebSocket();

  const { chats, error: chatsError, isLoading: chatsLoading } = ChatService.useChats();
  const {
    messages,
    error: messagesError,
    isLoading: messagesLoading,
  } = ChatService.useMessages(selectedChat?.id);

  useEffect(() => {
    if (selectedChat?.id) {
      const messageListener = ChatService.listenToMessages(selectedChat.id);

      return () => {
        messageListener.stopListening();
      };
    }
  }, [selectedChat?.id]);

  useEffect(() => {
    const chatUpdateListener = ChatService.listenToChatUpdates(null, currentUser?.id);
    const newChatListener = ChatService.listenToNewChats(null, currentUser?.id);

    return () => {
      chatUpdateListener.stopListening();
      newChatListener.stopListening();
    };
  }, [currentUser?.id]);

  useEffect(() => {
    const handleUrlParams = async () => {
      const chatId = searchParams.get('chatId');
      const postId = searchParams.get('postId');
      const postTitle = searchParams.get('postTitle');
      const postAuthorId = searchParams.get('postAuthorId');

      if (chatId && !chatsLoading && !urlParamsProcessed) {
        setUrlParamsProcessed(true);
        const chat = chats.find((c) => c.id === parseInt(chatId));
        if (chat) {
          setSelectedChat(chat);
          navigate('/employee/chats', { replace: true });
        } else {
          try {
            const chatResponse = await ChatService.getChat(parseInt(chatId));
            setSelectedChat(chatResponse.data);
            navigate('/employee/chats', { replace: true });
          } catch (error) {
            console.error('Error fetching chat:', error);
          }
        }
      } else if (postId && postTitle && !chatsLoading && !urlParamsProcessed) {
        setUrlParamsProcessed(true);
        handlePostChatRequest(parseInt(postId), postAuthorId ? parseInt(postAuthorId) : null);
      }
    };

    handleUrlParams();
  }, [searchParams, navigate, chatsLoading, currentUser?.id, chats]);

  const handlePostChatRequest = async (postId, postAuthorId = null) => {
    try {
      setSending(true);

      if (!currentUser?.id) {
        throw new Error('User not authenticated');
      }

      let employeeUserId;
      if (currentUser.role_id === 2) {
        if (!postAuthorId) {
          throw new Error('Post author ID is required for HR users');
        }
        employeeUserId = postAuthorId;
      } else {
        employeeUserId = currentUser.id;
      }

      try {
        const existingChat = await ChatService.getChatByPostAndEmployee(postId, employeeUserId);
        setSelectedChat(existingChat.data);
        navigate('/employee/chats', { replace: true });
      } catch (error) {
        if (error.response?.status === 404) {
          const newChat = await ChatService.createChat(postId, employeeUserId);
          setSelectedChat(newChat.data);
          navigate('/employee/chats', { replace: true });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error handling post chat request:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    try {
      setSending(true);
      await ChatService.sendMessage(selectedChat.id, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessage('');
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', bgcolor: 'grey.50' }}>
      <Box
        sx={{
          width: 380,
          bgcolor: 'white',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 1,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              💬 {t('ChatsANON.title')}
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              onClick={() => navigate('/employee')}
            >
              📝 {t('ChatsANON.viewPosts')}
            </Button>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {chats.length} {t('ChatsANON.activeChats')} • {t('ChatsANON.noChats')}
          </Typography>
        </Box>

        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {chatsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : chatsError ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Alert severity="error">{t('ChatsANON.failedToLoadChats')}</Alert>
            </Box>
          ) : chats.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('ChatsANON.noActiveChats')} {t('ChatsANON.noChats')}
              </Typography>
            </Box>
          ) : (
            chats.map((chat) => (
              <ListItem
                key={chat.id}
                selected={selectedChat?.id === chat.id}
                onClick={() => handleChatSelect(chat)}
                sx={{
                  cursor: 'pointer',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    borderLeft: '4px solid',
                    borderLeftColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                  },
                  ...(selectedChat?.id === chat.id && {
                    backgroundColor: 'grey.100',
                    borderLeft: '4px solid',
                    borderLeftColor: 'grey.400',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                    },
                  }),
                  '&:hover': {
                    backgroundColor: 'grey.50',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                    {chat.other_participant?.user.avatar ||
                      chat.other_participant?.user.name?.charAt(0) ||
                      chat.other_participant?.user.username?.charAt(0) ||
                      'U'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {chat.other_participant?.user.name || t('ChatsANON.unknownUser')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <span
                      style={{
                        marginBottom: '4px',
                        fontWeight: 500,
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: '0.875rem',
                        lineHeight: 1.43,
                        display: 'block',
                      }}
                    >
                      📝 {chat.post?.title || t('ChatsANON.unknownPost')}
                      <br />
                      💬 {chat.latest_message?.content || t('ChatsANON.noMessages')}
                      <br />
                      💬{' '}
                      {chat.last_message_at
                        ? new Date(chat.last_message_at).toLocaleString()
                        : t('ChatsANON.noActivity')}
                    </span>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', boxShadow: 1 }}
      >
        {selectedChat ? (
          <>
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
                }}
              >
                <Avatar
                  sx={{ bgcolor: 'secondary.main', width: 48, height: 48, fontSize: '1.1rem' }}
                >
                  {selectedChat.other_participant?.user.avatar ||
                    selectedChat.other_participant?.user.name?.charAt(0) ||
                    selectedChat.other_participant?.user.username?.charAt(0) ||
                    'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    👤 {selectedChat.other_participant?.user.name || t('ChatsANON.unknownUser')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💬 {t('ChatsANON.chattingAboutFeedback')}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  p: 3,
                  bgcolor: 'primary.50',
                  borderBottom: '1px solid',
                  borderColor: 'primary.200',
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}
                >
                  📝 Post: {selectedChat.post?.title || t('ChatsANON.unknownPost')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {selectedChat.post?.content || t('ChatsANON.noContentAvailable')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              {messagesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : messagesError ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Alert severity="error">{t('ChatsANON.failedToLoadMessages')}</Alert>
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('ChatsANON.noMessages')}
                  </Typography>
                </Box>
              ) : (
                messages.map((msg) => {
                  const isCurrentUserMessage =
                    msg.is_from_current_user || msg.sender_id === currentUser.employee?.id;
                  return (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isCurrentUserMessage ? 'flex-end' : 'flex-start',
                        mb: 2,
                        gap: 1,
                      }}
                    >
                      {!isCurrentUserMessage && (
                        <Avatar
                          sx={{
                            bgcolor: 'secondary.main',
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                          }}
                        >
                          {msg.sender_avatar || msg.sender_name?.charAt(0) || 'U'}
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {!isCurrentUserMessage && (
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                            {msg.sender_name}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: isCurrentUserMessage ? 'primary.main' : 'grey.100',
                            color: isCurrentUserMessage ? 'white' : 'text.primary',
                          }}
                        >
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {msg.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: isCurrentUserMessage
                                ? 'rgba(255,255,255,0.7)'
                                : 'text.secondary',
                            }}
                          >
                            {new Date(msg.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      {isCurrentUserMessage && (
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                          }}
                        >
                          {msg.sender_avatar || msg.sender_name?.charAt(0) || 'U'}
                        </Avatar>
                      )}
                    </Box>
                  );
                })
              )}
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder={t('ChatsANON.placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  disabled={sending}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  startIcon={sending ? <CircularProgress size={20} /> : <Send />}
                >
                  {sending ? t('ChatsANON.placeholderSending') : t('ChatsANON.placeholderSend')}
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
            }}
          >
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
                💬
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {t('ChatsANON.selectConversation')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('ChatsANON.chooseConversation')}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/employee')}
                sx={{ textTransform: 'none' }}
              >
                📝 {t('ChatsANON.browsePosts')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chats;
