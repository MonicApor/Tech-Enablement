import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCategories } from 'services/categories.service';
import ChatService from 'services/chat.service';
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from 'services/comment.service';
import { updatePost, useDeletePost, useFlagPost, useUpvotePost } from 'services/post.service';
import { postSchema } from 'validations/post';
import {
  Chat as ChatIcon,
  Comment,
  Delete,
  Edit,
  Flag,
  MoreVert,
  Reply,
  ThumbUp,
  Undo,
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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FileUpload from '../atoms/FileUpload';
import PostAttachments, { getFileIcon } from '../atoms/PostAttachments';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.profile.user);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editTexts, setEditTexts] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);
  const { categories } = useCategories();

  const { comments, isLoading: isLoadingComments } = useComments(post.id);

  const editForm = useForm({
    mode: 'onChange',
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: post.title,
      body: post.body,
      category_id: post.category.id,
    },
  });

  const {
    handleSubmit: handleEditSubmit,
    register: registerEdit,
    setValue: setEditValue,
    watch: watchEdit,
    formState: { errors: editErrors },
  } = editForm;

  const handleUpvote = async () => {
    try {
      await useUpvotePost(post.id);
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleReply = (commentId) => {
    setReplyTo(replyTo === commentId ? null : commentId);
    setReplyTexts((prev) => ({
      ...prev,
      [commentId]: '',
    }));
  };

  const handleSubmitComment = async () => {
    if (commentText.trim()) {
      try {
        await useCreateComment(commentText, post.id, null);
        setCommentText('');
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  const handleSubmitReply = async (commentId) => {
    const replyText = replyTexts[commentId];
    if (replyText && replyText.trim()) {
      try {
        await useCreateComment(replyText, post.id, commentId);
        setReplyTexts((prev) => ({
          ...prev,
          [commentId]: '',
        }));
        setReplyTo(null);
      } catch (error) {
        console.error('Error creating reply:', error);
      }
    }
  };

  const handleReport = async () => {
    try {
      await useFlagPost(post.id);
    } catch (error) {
      console.error('Error flagging post:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewFiles([]);
    setAttachmentsToRemove([]);
    editForm.reset({
      title: post.title,
      body: post.body,
      category_id: post.category.id,
    });
    handleMenuClose();
  };

  const handleNewFileChange = (files) => {
    setNewFiles(files);
  };

  const handleRemoveAttachment = (attachmentId) => {
    setAttachmentsToRemove((prev) => [...prev, attachmentId]);
  };

  const handleCancelRemoveAttachment = (attachmentId) => {
    setAttachmentsToRemove((prev) => prev.filter((id) => id !== attachmentId));
  };

  const handleSavePostEdit = async (data) => {
    setIsUpdating(true);
    try {
      const updateData = {
        ...data,
        files: newFiles,
        removeAttachments: attachmentsToRemove,
      };
      await updatePost(post.id, updateData);
      setIsEditing(false);
      setNewFiles([]);
      setAttachmentsToRemove([]);
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewFiles([]);
    setAttachmentsToRemove([]);
    editForm.reset({
      title: post.title,
      body: post.body,
      category_id: post.category.id,
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteComment = async (commentId) => {
    await useDeleteComment(commentId, post.id);
  };

  const handleDeleteReply = async (replyId) => {
    await useDeleteComment(replyId, post.id);
  };

  const handleEditComment = (commentId, currentText) => {
    setEditingComment(editingComment === commentId ? null : commentId);
    setEditTexts((prev) => ({
      ...prev,
      [commentId]: currentText,
    }));
  };

  const handleEditReply = (replyId, currentText) => {
    setEditingReply(editingReply === replyId ? null : replyId);
    setEditTexts((prev) => ({
      ...prev,
      [replyId]: currentText,
    }));
  };

  const handleSaveCommentEdit = async (itemId, isReply = false) => {
    const editText = editTexts[itemId];
    if (editText && editText.trim()) {
      try {
        await useUpdateComment(itemId, { body: editText }, post.id);
        if (isReply) {
          setEditingReply(null);
        } else {
          setEditingComment(null);
        }
        setEditTexts((prev) => ({
          ...prev,
          [itemId]: '',
        }));
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await useDeletePost(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteDialogClose = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }} aria-label="author">
              {post.employee.user.avatar}
            </Avatar>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 2 }}>
                {post.created_at_human}
              </Typography>
              <IconButton aria-label="report" onClick={handleReport}>
                <Flag fontSize="small" color={post.is_flagged ? 'error' : 'default'} />
              </IconButton>
              {currentUser && currentUser.username === post.employee.user.username && (
                <IconButton aria-label="more options" onClick={handleMenuOpen}>
                  <MoreVert />
                </IconButton>
              )}
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
                <MenuItem onClick={handleEdit} disabled={isEditing}>
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          }
          title={
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Typography variant="h6" fontWeight={600}>
                {isEditing ? 'Editing Post' : post.title}
              </Typography>
              <Chip
                label={post.category.name}
                size="small"
                color="primary"
                variant="outlined"
                component="span"
              />
            </Box>
          }
          subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                by {post.employee.user.username} • {post.created_at_human}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Visibility fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {post.views_count}
                </Typography>
              </Box>
            </Box>
          }
        />

        <CardContent>
          {isEditing ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Title"
                {...registerEdit('title')}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                error={!!editErrors.title}
                helperText={editErrors.title?.message}
              />
              <TextField
                fullWidth
                label="Content"
                {...registerEdit('body')}
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 2 }}
                error={!!editErrors.body}
                helperText={editErrors.body?.message}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Category:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {categories &&
                    categories.map((category) => {
                      const selectedCategoryId = watchEdit('category_id');
                      const isSelected = selectedCategoryId === category.id;
                      const hasError = editErrors?.category_id && selectedCategoryId === 0;

                      return (
                        <Chip
                          key={category.id}
                          label={category.name}
                          variant={isSelected ? 'filled' : 'outlined'}
                          size="small"
                          color={hasError ? 'error' : isSelected ? 'primary' : 'default'}
                          component="span"
                          onClick={() => {
                            setEditValue('category_id', category.id);
                          }}
                          sx={{ cursor: 'pointer' }}
                        />
                      );
                    })}
                </Box>
              </Box>

              {post.attachments && post.attachments.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Current Attachments:
                  </Typography>
                  <List dense>
                    {post.attachments.map((attachment) => {
                      const isMarkedForRemoval = attachmentsToRemove.includes(attachment.id);
                      return (
                        <ListItem
                          key={attachment.id}
                          sx={{
                            border: '1px solid',
                            borderColor: isMarkedForRemoval ? 'error.main' : 'grey.200',
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor: isMarkedForRemoval ? 'error.50' : 'background.paper',
                            opacity: isMarkedForRemoval ? 0.6 : 1,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {getFileIcon(attachment)}
                          </ListItemIcon>
                          <ListItemText
                            primary={attachment.original_name}
                            secondary={
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  marginTop: 4,
                                }}
                              >
                                <Chip
                                  label={attachment.human_file_size}
                                  size="small"
                                  variant="outlined"
                                  component="span"
                                  sx={{ height: 20, fontSize: '0.75rem' }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  component="span"
                                >
                                  {attachment.mime_type}
                                </Typography>
                              </span>
                            }
                          />
                          {isMarkedForRemoval ? (
                            <IconButton
                              edge="end"
                              aria-label="cancel remove"
                              onClick={() => handleCancelRemoveAttachment(attachment.id)}
                              color="success"
                              size="small"
                              title="Cancel Remove"
                            >
                              <Undo />
                            </IconButton>
                          ) : (
                            <IconButton
                              edge="end"
                              aria-label="remove attachment"
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              color="error"
                              size="small"
                              title="Remove Attachment"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Add New Files:
                </Typography>
                <FileUpload
                  onFileChange={handleNewFileChange}
                  clearFiles={false}
                  initialFiles={newFiles}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCancelEdit} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditSubmit(handleSavePostEdit)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.body}
              </Typography>
              <PostAttachments attachments={post.attachments} />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Upvote">
              <IconButton onClick={handleUpvote} color={post.is_upvoted ? 'primary' : 'default'}>
                <ThumbUp fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
              {post.upvotes_count}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button startIcon={<Comment />} onClick={handleComment} size="small" variant="text">
              {post.comments_count} Comments
            </Button>

            {currentUser && currentUser.role === 'hr' && (
              <Button
                variant="outline"
                size="small"
                startIcon={<ChatIcon />}
                onClick={async () => {
                  try {
                    const employeeUserId = post.user.id;
                    const existingChat = await ChatService.getChatByPostAndEmployee(
                      post.id,
                      employeeUserId
                    );
                    navigate(`/employee/chats?chatId=${existingChat.data.id}`);
                  } catch (error) {
                    if (error.response?.status === 404) {
                      const newChat = await ChatService.createChat(post.id, post.user.id);
                      navigate(`/employee/chats?chatId=${newChat.data.id}`);
                    } else {
                      console.error('Error handling chat:', error);
                    }
                  }
                }}
              >
                Chat
              </Button>
            )}
          </Box>
        </CardActions>

        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Comments ({post.comments_count})
            </Typography>

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

            <List sx={{ p: 0 }}>
              {isLoadingComments ? (
                <Typography>Loading comments...</Typography>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <React.Fragment key={comment.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                          {comment.user?.username?.charAt(0) || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            {editingComment === comment.id ? (
                              <Box sx={{ mb: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  value={editTexts[comment.id] || ''}
                                  onChange={(e) =>
                                    setEditTexts((prev) => ({
                                      ...prev,
                                      [comment.id]: e.target.value,
                                    }))
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                  <Button size="small" onClick={() => setEditingComment(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleSaveCommentEdit(comment.id)}
                                    disabled={!editTexts[comment.id]?.trim()}
                                  >
                                    Save
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {comment.body}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Typography variant="caption" color="text.secondary">
                                by {comment.user?.username} • {comment.created_at_human}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton size="small">
                                  <ThumbUp fontSize="small" />
                                </IconButton>
                                <Typography variant="caption">{comment.upvotes_count}</Typography>
                                <Button
                                  size="small"
                                  startIcon={<Reply />}
                                  onClick={() => handleReply(comment.id)}
                                >
                                  {replyTo === comment.id ? 'Cancel Reply' : 'Reply'}
                                </Button>
                                {currentUser && currentUser.username === comment.user?.username && (
                                  <>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleEditComment(comment.id, comment.body)}
                                    >
                                      <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDeleteComment(comment.id)}
                                    >
                                      <Delete fontSize="small" />
                                    </IconButton>
                                  </>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>

                    {replyTo === comment.id && (
                      <Box sx={{ ml: 4, mb: 2 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Write your reply..."
                          value={replyTexts[comment.id] || ''}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [comment.id]: e.target.value,
                            }))
                          }
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button size="small" onClick={() => handleReply(comment.id)}>
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyTexts[comment.id]?.trim()}
                          >
                            Post Reply
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {comment.replies &&
                      comment.replies.length > 0 &&
                      comment.replies.map((reply) => (
                        <ListItem key={reply.id} sx={{ px: 0, py: 1, pl: 4 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'grey.500', width: 28, height: 28 }}>
                              {reply.user?.username?.charAt(0) || 'U'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box>
                                {editingReply === reply.id ? (
                                  <Box sx={{ mb: 1 }}>
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
                                      value={editTexts[reply.id] || ''}
                                      onChange={(e) =>
                                        setEditTexts((prev) => ({
                                          ...prev,
                                          [reply.id]: e.target.value,
                                        }))
                                      }
                                      variant="outlined"
                                      size="small"
                                      sx={{ mb: 1 }}
                                    />
                                    <Box
                                      sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                                    >
                                      <Button size="small" onClick={() => setEditingReply(null)}>
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleSaveCommentEdit(reply.id, true)}
                                        disabled={!editTexts[reply.id]?.trim()}
                                      >
                                        Save
                                      </Button>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    {reply.body}
                                  </Typography>
                                )}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    by {reply.user?.username} • {reply.created_at_human}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton size="small">
                                      <ThumbUp fontSize="small" />
                                    </IconButton>
                                    <Typography variant="caption">{reply.upvotes_count}</Typography>
                                    {currentUser &&
                                      currentUser.username === reply.user?.username && (
                                        <>
                                          <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditReply(reply.id, reply.body)}
                                          >
                                            <Edit fontSize="small" />
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteReply(reply.id)}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </>
                                      )}
                                  </Box>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}

                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography color="text.secondary">
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </List>
          </CardContent>
        </Collapse>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete <strong>${post.title}</strong> post? This action cannot be undone.`}
        loading={isDeleting}
      />
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
