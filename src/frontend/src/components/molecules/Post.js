import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chat as ChatIcon,
  Comment,
  Flag,
  MoreVert,
  Reply,
  Share,
  ThumbUp,
  ThumbUpOutlined,
  Visibility,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const mockPost = post || {
    id: 1,
    title: 'New Office Policy Implementation',
    content:
      'I think the new office policy regarding remote work is great, but I have some concerns about the implementation timeline. Has anyone else noticed that the transition period might be too short?',
    author: 'Anonymous Employee',
    authorInitial: 'A',
    category: 'Policy',
    upvotes: 127,
    downvotes: 12,
    views: 456,
    comments: 23,
    isUpvoted: false,
    isDownvoted: false,
    createdAt: '2 hours ago',
    tags: ['remote-work', 'policy', 'implementation'],
    commentsList: [
      {
        id: 1,
        author: 'Anonymous',
        authorInitial: 'A',
        content: 'I agree with the timeline concern. We need more time to adjust our workflows.',
        upvotes: 15,
        createdAt: '1 hour ago',
        replies: [
          {
            id: 11,
            author: 'Anonymous',
            authorInitial: 'A',
            content: 'Exactly! At least 3 months would be reasonable.',
            upvotes: 8,
            createdAt: '30 min ago',
          },
        ],
      },
      {
        id: 2,
        author: 'Anonymous',
        authorInitial: 'A',
        content: 'The policy itself is good, but the communication could be better.',
        upvotes: 12,
        createdAt: '45 min ago',
        replies: [],
      },
    ],
  };

  const handleUpvote = () => {
    // TODO: Implement upvote logic
    console.log('Upvoted post:', mockPost.id);
  };

  const handleDownvote = () => {
    // TODO: Implement downvote logic
    console.log('Downvoted post:', mockPost.id);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    setCommentText('');
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      // TODO: Implement comment submission
      console.log('Submitting comment:', commentText, 'Reply to:', replyTo);
      setCommentText('');
      setReplyTo(null);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing post:', mockPost.id);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log('Reporting post:', mockPost.id);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Editing post:', mockPost.id);
    handleMenuClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting post:', mockPost.id);
    handleMenuClose();
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="author">
            {mockPost.authorInitial}
          </Avatar>
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {mockPost.createdAt}
            </Typography>
            <IconButton aria-label="report" onClick={handleReport}>
              <Flag fontSize="small" />
            </IconButton>
            <IconButton aria-label="more options" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                Delete
              </MenuItem>
            </Menu>
          </Box>
        }
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" fontWeight={600}>
              {mockPost.title}
            </Typography>
            <Chip label={mockPost.category} size="small" color="primary" variant="outlined" />
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              by {mockPost.author} • {mockPost.createdAt}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {mockPost.views}
              </Typography>
            </Box>
          </Box>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {mockPost.content}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {mockPost.tags.map((tag, index) => (
            <Chip key={index} label={`#${tag}`} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Upvote">
            <IconButton onClick={handleUpvote} color={mockPost.isUpvoted ? 'primary' : 'default'}>
              <ThumbUp fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
            {mockPost.upvotes - mockPost.downvotes}
          </Typography>
          <Tooltip title="Downvote">
            <IconButton onClick={handleDownvote} color={mockPost.isDownvoted ? 'error' : 'default'}>
              <ThumbUpOutlined fontSize="small" sx={{ transform: 'rotate(180deg)' }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button startIcon={<Comment />} onClick={handleComment} size="small" variant="text">
            {mockPost.comments} Comments
          </Button>

          <Tooltip title="Share">
            <IconButton onClick={handleShare}>
              <Share fontSize="small" />
            </IconButton>
          </Tooltip>

          <Button
            variant="outline"
            size="small"
            startIcon={<ChatIcon />}
            onClick={() =>
              navigate(
                `/employee/chats?postId=${mockPost.id}&postTitle=${encodeURIComponent(
                  mockPost.title
                )}`
              )
            }
          >
            Chat
          </Button>
        </Box>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments ({mockPost.comments})
          </Typography>

          {/* Add Comment */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                Post Comment
              </Button>
            </Box>
          </Box>

          {/* Comments List */}
          <List sx={{ p: 0 }}>
            {mockPost.commentsList?.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      {comment.authorInitial}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {comment.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            by {comment.author} • {comment.createdAt}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton size="small">
                              <ThumbUp fontSize="small" />
                            </IconButton>
                            <Typography variant="caption">{comment.upvotes}</Typography>
                            <Button
                              size="small"
                              startIcon={<Reply />}
                              onClick={() => handleReply(comment.id)}
                            >
                              Reply
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>

                {/* Replies */}
                {comment.replies.map((reply) => (
                  <ListItem key={reply.id} sx={{ px: 0, py: 1, pl: 4 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'grey.500', width: 28, height: 28 }}>
                        {reply.authorInitial}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {reply.content}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              by {reply.author} • {reply.createdAt}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton size="small">
                                <ThumbUp fontSize="small" />
                              </IconButton>
                              <Typography variant="caption">{reply.upvotes}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}

                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Collapse>
    </Card>
  );
};

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
