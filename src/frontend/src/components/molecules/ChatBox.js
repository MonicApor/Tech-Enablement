import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Close, Send } from '@mui/icons-material';
import { Avatar, Box, Button, Drawer, IconButton, TextField, Typography } from '@mui/material';

const ChatBox = ({ isOpen, onClose, postId, postTitle }) => {
  console.log(postId, postTitle);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
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
      content: 'We need better integration between our project management and communication tools.',
      timestamp: '1:50 PM',
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'hr',
      username: 'HR Manager',
      avatar: 'HR',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400, md: 500 },
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Chat about: {postTitle}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        {messages.map((msg) => (
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
    </Drawer>
  );
};

ChatBox.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  postId: PropTypes.number,
  postTitle: PropTypes.string,
};

export default ChatBox;
