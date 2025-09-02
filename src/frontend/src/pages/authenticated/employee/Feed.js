import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCategories } from 'services/categories.service';
import { useCreatePost, usePosts } from 'services/post.service';
import { defaultValuesPost, postSchema } from 'validations/post';
import { Message } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import FileUpload from 'components/atoms/FileUpload';
import Post from 'components/molecules/Post';

function Feed() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('desc');
  const { categories } = useCategories();
  const { posts, meta, isLoading: postsLoading } = usePosts(page, search, selectedCategory, sort);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handlePageChange = (event, value) => {
    event.preventDefault();
    setPage(value);
  };

  // debounce search prevents calling the api on every key press
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearch(value);
          setPage(1);
        }, 500);
      };
    })(),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchDisplay(value);
    debouncedSearch(value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleFileChange = (files) => {
    console.log('Files received:', files);
    setSelectedFiles(files);
  };

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(postSchema),
    defaultValues: defaultValuesPost,
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    const formDataWithFiles = {
      ...data,
      files: selectedFiles,
    };

    console.log('Submitting form with files:', formDataWithFiles);
    await useCreatePost(formDataWithFiles);
    reset();
    setSelectedFiles([]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardHeader title="Share Anonymous Feedback" />
        <CardContent component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            placeholder="Enter your feedback title..."
            variant="outlined"
            sx={{ mb: 2 }}
            {...register('title')}
            error={errors && errors.title ? true : false}
            helperText={errors ? errors?.title?.message : null}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind? Your feedback is completely anonymous..."
            variant="outlined"
            sx={{ mb: 2 }}
            {...register('body')}
            error={errors && errors.body ? true : false}
            helperText={errors ? errors?.body?.message : null}
          />
          <FileUpload onFileChange={handleFileChange} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {categories &&
                categories.map((category) => {
                  const selectedCategoryId = watch('category_id');
                  const isSelected = selectedCategoryId === category.id;
                  const hasError = errors?.category_id && selectedCategoryId === 0;

                  return (
                    <Chip
                      key={category.id}
                      label={category.name}
                      variant={isSelected ? 'filled' : 'outlined'}
                      size="small"
                      color={hasError ? 'error' : isSelected ? 'primary' : 'default'}
                      onClick={() => {
                        setValue('category_id', category.id);
                      }}
                    />
                  );
                })}
            </Box>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<Message />} type="submit">
              Post Feedback
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search posts..."
              value={searchDisplay}
              onChange={handleSearchChange}
              size="small"
              sx={{ flex: 1 }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                {categories &&
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort</InputLabel>
              <Select value={sort} onChange={handleSortChange} label="Sort">
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {postsLoading ? (
          <div>Loading posts...</div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <div>No posts found.</div>
        )}

        {meta && meta.total > meta.per_page && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(meta.total / meta.per_page)}
              page={parseInt(meta.current_page)}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Feed;
