import React, { useEffect, useState } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Post from 'components/molecules/Post';

function Feed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // Show 3 posts per page

  // Mock posts data - replace with actual API call
  const posts = [
    {
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
    },
    {
      id: 2,
      title: 'Team Building Event Ideas',
      content:
        "Looking for suggestions for our next team building event. We want something that everyone can participate in, whether they're remote or in-office. Any creative ideas?",
      author: 'Anonymous Employee',
      authorInitial: 'A',
      category: 'Events',
      upvotes: 89,
      downvotes: 5,
      views: 234,
      comments: 15,
      isUpvoted: true,
      isDownvoted: false,
      createdAt: '4 hours ago',
      tags: ['team-building', 'events', 'remote'],
    },
    {
      id: 3,
      title: 'IT Support Process Improvements',
      content:
        'The current IT support process takes too long. I submitted a ticket 3 days ago and still no response. Anyone else experiencing this? We need a better system.',
      author: 'Anonymous Employee',
      authorInitial: 'A',
      category: 'IT',
      upvotes: 67,
      downvotes: 8,
      views: 189,
      comments: 12,
      isUpvoted: false,
      isDownvoted: false,
      createdAt: '6 hours ago',
      tags: ['it-support', 'process', 'improvement'],
    },
    {
      id: 4,
      title: 'Employee Wellness Program Feedback',
      content:
        'The new wellness program is amazing! I love the gym membership reimbursement and mental health days. Has anyone tried the meditation sessions?',
      author: 'Anonymous Employee',
      authorInitial: 'A',
      category: 'Wellness',
      upvotes: 156,
      downvotes: 3,
      views: 567,
      comments: 31,
      isUpvoted: false,
      isDownvoted: false,
      createdAt: '8 hours ago',
      tags: ['wellness', 'mental-health', 'gym'],
    },
    {
      id: 5,
      title: 'Workplace Communication Tools',
      content:
        "We're considering switching from Slack to Microsoft Teams. What are your thoughts? I'm concerned about the learning curve and integration with our existing tools.",
      author: 'Anonymous Employee',
      authorInitial: 'A',
      category: 'Workplace',
      upvotes: 43,
      downvotes: 15,
      views: 123,
      comments: 8,
      isUpvoted: false,
      isDownvoted: true,
      createdAt: '12 hours ago',
      tags: ['communication', 'tools', 'microsoft-teams'],
    },
  ];

  const categories = [
    { key: 'all', label: 'All Posts', color: 'primary' },
    { key: 'policy', label: 'Policy', color: 'secondary' },
    { key: 'workplace', label: 'Workplace', color: 'success' },
    { key: 'events', label: 'Events', color: 'warning' },
    { key: 'it', label: 'IT', color: 'info' },
    { key: 'wellness', label: 'Wellness', color: 'error' },
  ];

  // Filter posts based on search query and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search posts, topics, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Category Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="action" />
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Filter by:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {categories.map((category) => (
              <Chip
                key={category.key}
                label={category.label}
                color={selectedCategory === category.key ? category.color : 'default'}
                variant={selectedCategory === category.key ? 'filled' : 'outlined'}
                onClick={() => setSelectedCategory(category.key)}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        {/* Results Count */}
        <Typography variant="body2" color="text.secondary">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of{' '}
          {filteredPosts.length} posts
        </Typography>
      </Box>

      {/* Posts Feed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No posts found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search terms or category filter
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}

export default Feed;
