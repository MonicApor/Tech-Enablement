import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCategories } from 'services/categories.service';
import ChatService from 'services/chat.service';
import {
  // useComments,
  createComment,
  deleteComment,
  updateComment,
} from 'services/comment.service';
import { updatePost, useDeletePost, useUpvotePost } from 'services/post.service';
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
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FileUpload from '../atoms/FileUpload';
import PostAttachments, { getFileIcon } from '../atoms/PostAttachments';
import DeleteConfirmDialog from './DeleteConfirmDialog';

const Post = ({ post }) => {
  const { t } = useTranslation();
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

  // const { comments, isLoading: isLoadingComments } = useComments(post.id);

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
        await createComment(commentText, post.id, null);
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
        await createComment(replyText, post.id, commentId);
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

  // const handleReport = async () => {
  //   try {
  //     await useFlagPost(post.id);
  //   } catch (error) {
  //     console.error('Error flagging post:', error);
  //   }
  // };

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
    await deleteComment(commentId);
  };

  const handleDeleteReply = async (replyId) => {
    await deleteComment(replyId);
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
        await updateComment(itemId, { body: editText });
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

  const statusBadge = () => {
    switch (post.flag_status_id) {
      case 1:
        return t('FlaggedPostsANON.open');
      case 2:
        return t('FlaggedPostsANON.inReview');
      case 3:
        return t('FlaggedPostsANON.escalated');
      case null && post.is_resolved:
        return t('FlaggedPostsANON.resolved');
      default:
        return t('FlaggedPostsANON.open');
    }
  };

  const statusColor = () => {
    switch (post.flag_status_id) {
      case 1:
        return 'info';
      case 2:
        return 'warning';
      case 3:
        return 'error';
      case null && post.is_resolved:
        return 'success';
      default:
        return 'info';
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
              <IconButton aria-label="report">
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
                  {t('PostANON.edit')}
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                  {t('PostANON.delete')}
                </MenuItem>
              </Menu>
            </Box>
          }
          title={
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <Typography variant="h6" fontWeight={600}>
                {isEditing ? t('PostANON.editingPost') : post.title}
              </Typography>
              <Stack direction="row" spacing={1}>
                {post.is_flagged && (
                  <Chip
                    label={statusBadge(post.flag_status_id)}
                    color={statusColor(post.flag_status_id)}
                    size="small"
                    sx={{ fontSize: '0.75rem', width: 100 }}
                  />
                )}
                <Chip
                  label={post.category.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                  component="span"
                />
              </Stack>
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
                label={t('PostANON.titlePost')}
                {...registerEdit('title')}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                error={!!editErrors.title}
                helperText={editErrors.title?.message}
              />
              <TextField
                fullWidth
                label={t('PostANON.content')}
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
                  {t('PostANON.category')}:
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
                    {t('PostANON.currentAttachments')}:
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
                              title={t('PostANON.cancelRemove')}
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
                              title={t('PostANON.removeAttachment')}
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
                  {t('PostANON.addNewFiles')}:
                </Typography>
                <FileUpload
                  onFileChange={handleNewFileChange}
                  clearFiles={false}
                  initialFiles={newFiles}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={handleCancelEdit} disabled={isUpdating}>
                  {t('PostANON.cancel')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditSubmit(handleSavePostEdit)}
                  disabled={isUpdating}
                >
                  {isUpdating ? t('PostANON.saving') : t('PostANON.save')}
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
            <Tooltip title={t('PostANON.upvote')}>
              <IconButton onClick={handleUpvote} color={post.is_upvoted ? 'primary' : 'default'}>
                <ThumbUp fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
              {post.upvotes_count}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<Comment />}
              onClick={handleComment}
              size="small"
              variant="text"
              disabled={post.is_resolved}
            >
              {post.comments.length} {t('PostANON.comments')}
            </Button>

            {currentUser &&
              currentUser.role_id === 2 &&
              currentUser.id !== post.employee.user.id && (
                <Button
                  variant="outline"
                  size="small"
                  startIcon={<ChatIcon />}
                  onClick={async () => {
                    try {
                      const employeeUserId = post.employee.user.id;
                      const existingChat = await ChatService.getChatByPostAndEmployee(
                        post.id,
                        employeeUserId
                      );
                      navigate(`/employee/chats?chatId=${existingChat.data.id}`);
                    } catch (error) {
                      if (error.response?.status === 404) {
                        const newChat = await ChatService.createChat(
                          post.id,
                          post.employee.user.id
                        );
                        navigate(`/employee/chats?chatId=${newChat.data.id}`);
                      } else {
                        console.error('Error handling chat:', error);
                      }
                    }
                  }}
                >
                  {t('PostANON.chat')}
                </Button>
              )}
          </Box>
        </CardActions>

        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Divider />
          <CardContent sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('PostANON.comments')} ({post.comments_count})
            </Typography>

            {!post.is_resolved && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder={t('PostANON.addComment')}
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
                    {t('PostANON.postComment')}
                  </Button>
                </Box>
              </Box>
            )}

            {post.is_resolved && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {t('PostANON.commentsDisabled')}
                </Typography>
              </Box>
            )}

            <List sx={{ p: 0 }}>
              {/* {isLoadingComments ? (
                <Typography>{t('PostANON.loadingComments')}</Typography>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => ( */}
              {post.comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        {comment.employee?.user?.username?.charAt(0) || 'U'}
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
                                  {t('PostANON.cancel')}
                                </Button>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleSaveCommentEdit(comment.id)}
                                  disabled={!editTexts[comment.id]?.trim()}
                                >
                                  {t('PostANON.save')}
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
                              by {comment.employee?.user?.username} • {comment.created_at_human}
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
                                {replyTo === comment.id
                                  ? t('PostANON.cancelReply')
                                  : t('PostANON.reply')}
                              </Button>
                              {currentUser &&
                                currentUser.username === comment.employee?.user?.username && (
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
                        placeholder={t('PostANON.writeReply')}
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
                          {t('PostANON.cancel')}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyTexts[comment.id]?.trim()}
                        >
                          {t('PostANON.postReply')}
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
                            {reply.employee?.user?.username?.charAt(0) || 'U'}
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
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button size="small" onClick={() => setEditingReply(null)}>
                                      {t('PostANON.cancel')}
                                    </Button>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleSaveCommentEdit(reply.id, true)}
                                      disabled={!editTexts[reply.id]?.trim()}
                                    >
                                      {t('PostANON.save')}
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
                                  by {reply.employee?.user?.username} • {reply.created_at_human}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <IconButton size="small">
                                    <ThumbUp fontSize="small" />
                                  </IconButton>
                                  <Typography variant="caption">{reply.upvotes_count}</Typography>
                                  {currentUser &&
                                    currentUser.username === reply.employee?.user?.username && (
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
              ))}
              {/* ) : ( */}
              {post.comments.length === 0 && (
                <Typography color="text.secondary">{t('PostANON.noComments')}</Typography>
              )}
              {/* )} */}
            </List>
          </CardContent>
        </Collapse>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title={t('PostANON.deletePost')}
        message={t('PostANON.messageDeletePost', { title: post.title })}
        loading={isDeleting}
      />
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object,
};

export default Post;
