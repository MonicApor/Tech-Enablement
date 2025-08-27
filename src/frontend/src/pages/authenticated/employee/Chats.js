import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

const Chats = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  // Handle URL parameters to auto-select conversation
  useEffect(() => {
    const postId = searchParams.get('postId');
    const postTitle = searchParams.get('postTitle');

    if (postId && postTitle) {
      // Find existing conversation for this post
      const existingChat = conversations.find((conv) => conv.postId === parseInt(postId));

      if (existingChat) {
        // Auto-select existing conversation
        setSelectedChat(existingChat);
      } else {
        // Create new conversation for this post
        const newChat = {
          id: Date.now(),
          postId: parseInt(postId),
          postTitle: decodeURIComponent(postTitle),
          postContent: 'Click "Chat" on any post to start a conversation about that feedback.',
          participant: 'Anonymous Employee',
          avatar: 'AE',
          lastMessage: 'New conversation started',
          timestamp: 'Just now',
          unreadCount: 0,
          messages: [
            {
              id: 1,
              sender: 'hr',
              username: 'HR Manager',
              avatar: 'HR',
              content: `Hi! I saw your feedback about "${decodeURIComponent(
                postTitle
              )}". I'd like to discuss this with you.`,
              timestamp: 'Just now',
            },
          ],
        };

        // Add to conversations and select it
        conversations.unshift(newChat);
        setSelectedChat(newChat);
      }

      // Clear URL parameters
      navigate('/employee/chats', { replace: true });
    }
  }, [searchParams, navigate]);

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      postId: 1,
      postTitle: 'New Office Policy Implementation',
      postContent:
        'I think the new office policy regarding remote work is great, but I have some concerns about the implementation timeline. Has anyone else noticed that the transition period might be too short?',
      participant: 'Anonymous Employee',
      avatar: 'AE',
      lastMessage:
        'We need better integration between our project management and communication tools.',
      timestamp: '1:50 PM',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          sender: 'hr',
          username: 'HR Manager',
          avatar: 'HR',
          content:
            'Hi! I saw your feedback about the collaboration tools. What specific improvements would you like to see?',
          timestamp: '1:45 PM',
        },
        {
          id: 2,
          sender: 'employee',
          username: 'Anonymous Employee',
          avatar: 'AE',
          content:
            'We need better integration between our project management and communication tools.',
          timestamp: '1:50 PM',
        },
      ],
    },
    {
      id: 2,
      postId: 2,
      postTitle: 'Team Building Event Ideas',
      postContent:
        "Looking for suggestions for our next team building event. We want something that everyone can participate in, whether they're remote or in-office. Any creative ideas?",
      participant: 'Anonymous Employee',
      avatar: 'AE',
      lastMessage: 'I think we should consider a virtual escape room!',
      timestamp: '3:20 PM',
      unreadCount: 0,
      messages: [
        {
          id: 1,
          sender: 'hr',
          username: 'HR Manager',
          avatar: 'HR',
          content:
            'Thanks for the team building suggestions! What type of activities do you think would work best for our remote team?',
          timestamp: '2:30 PM',
        },
        {
          id: 2,
          sender: 'employee',
          username: 'Anonymous Employee',
          avatar: 'AE',
          content: 'I think we should consider a virtual escape room!',
          timestamp: '3:20 PM',
        },
      ],
    },
    {
      id: 3,
      postId: 3,
      postTitle: 'IT Support Process Improvements',
      postContent:
        'The current IT support process takes too long. I submitted a ticket 3 days ago and still no response. Anyone else experiencing this? We need a better system.',
      participant: 'Anonymous Employee',
      avatar: 'AE',
      lastMessage: 'The response time has improved significantly.',
      timestamp: 'Yesterday',
      unreadCount: 1,
      messages: [
        {
          id: 1,
          sender: 'hr',
          username: 'HR Manager',
          avatar: 'HR',
          content:
            "I understand your concern about IT support response times. We're working on improving this process.",
          timestamp: 'Yesterday',
        },
        {
          id: 2,
          sender: 'employee',
          username: 'Anonymous Employee',
          avatar: 'AE',
          content: 'The response time has improved significantly.',
          timestamp: 'Yesterday',
        },
      ],
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'hr',
      username: 'HR Manager',
      avatar: 'HR',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update the selected chat's messages
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedChat.id ? { ...conv, messages: [...conv.messages, newMessage] } : conv
    );

    // Update the conversation in the list
    const updatedSelectedChat = updatedConversations.find((conv) => conv.id === selectedChat.id);
    setSelectedChat(updatedSelectedChat);

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (conversation) => {
    setSelectedChat(conversation);
    setMessage('');
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', bgcolor: 'grey.50' }}>
      {/* Sidebar - Conversations List */}
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
        {/* Header */}
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
              💬 Conversations
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
              📝 View Posts
            </Button>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {conversations.length} active chats • Click &quot;Chat&quot; on any post to start a
            conversation
          </Typography>
        </Box>

        {/* Conversations List */}
        <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.id}
              button
              selected={selectedChat?.id === conversation.id}
              onClick={() => handleChatSelect(conversation)}
              sx={{
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
                '&:hover': {
                  backgroundColor: 'grey.50',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                  {conversation.avatar}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {conversation.participant}
                    </Typography>
                    {conversation.unreadCount > 0 && (
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                        }}
                      >
                        {conversation.unreadCount}
                      </Box>
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5, fontWeight: 500 }}
                    >
                      📝 {conversation.postTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      💬 {conversation.lastMessage}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {conversation.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white', boxShadow: 1 }}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Participant Info */}
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
                  {selectedChat.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    👤 {selectedChat.participant}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    💬 Chatting about their feedback
                  </Typography>
                </Box>
              </Box>

              {/* Original Post Context */}
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
                  📝 Original Feedback: {selectedChat.postTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {selectedChat.postContent}
                </Typography>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              {selectedChat.messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'hr' ? 'flex-end' : 'flex-start',
                    mb: 2,
                    gap: 1,
                  }}
                >
                  {msg.sender === 'employee' && (
                    <Avatar
                      sx={{
                        bgcolor: 'secondary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                      }}
                    >
                      {msg.avatar}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {msg.sender === 'employee' && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        {msg.username}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: msg.sender === 'hr' ? 'primary.main' : 'grey.100',
                        color: msg.sender === 'hr' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {msg.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: msg.sender === 'hr' ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        }}
                      >
                        {msg.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                  {msg.sender === 'hr' && (
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 32,
                        height: 32,
                        fontSize: '0.75rem',
                      }}
                    >
                      {msg.avatar}
                    </Avatar>
                  )}
                </Box>
              ))}
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  startIcon={<Send />}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          /* No Chat Selected */
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
                Select a conversation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a conversation from the sidebar to start chatting
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/employee')}
                sx={{ textTransform: 'none' }}
              >
                📝 Browse Posts
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chats;
