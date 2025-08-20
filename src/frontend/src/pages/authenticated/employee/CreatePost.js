import React, { useState } from 'react';
import { Add as AddIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'policy', label: 'Policy' },
    { value: 'workplace', label: 'Workplace' },
    { value: 'events', label: 'Events' },
    { value: 'it', label: 'IT' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'general', label: 'General' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'newTag') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log('Submitting post:', formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: [],
      });

      // TODO: Show success message and redirect to feed
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Create New Post
      </Typography>

      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <TextField
              fullWidth
              label="Post Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Enter a descriptive title for your post'}
              sx={{ mb: 3 }}
              placeholder="e.g., New Office Policy Implementation"
            />

            {/* Category Selection */}
            <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>

            {/* Content Field */}
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Post Content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              error={!!errors.content}
              helperText={errors.content || 'Share your thoughts, questions, or suggestions'}
              sx={{ mb: 3 }}
              placeholder="Write your post content here..."
            />

            {/* Tags Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Tags (optional)
              </Typography>

              {/* Add Tag Input */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  name="newTag"
                  size="small"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  startIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Box>

              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      deleteIcon={<CloseIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              )}
            </Box>

            {/* Anonymous Notice */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Note:</strong> Your post will be published anonymously. Your identity will
                be protected.
              </Typography>
            </Alert>

            {/* Submit Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setFormData({
                    title: '',
                    content: '',
                    category: '',
                    tags: [],
                  });
                  setErrors({});
                }}
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={<SendIcon />}
                sx={{ minWidth: 120 }}
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CreatePost;
