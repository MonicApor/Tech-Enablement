import React from 'react';
import { Message } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardHeader, Chip, TextField } from '@mui/material';
import Post from 'components/molecules/Post';

function Feed() {
  // Mock posts data - replace with actual API call
  const posts = [
    {
      id: 1,
      title: 'New Office Policy Implementation',
      content:
        'I think the new office policy regarding remote work is great, but I have some concerns about the implementation timeline. Has anyone else noticed that the transition period might be too short?',
      author: 'Anonymous Employee',
      authorInitial: 'A',
      category: 'Policy Feedback',
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
      category: 'Technology',
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
      category: 'Workplace',
      upvotes: 156,
      downvotes: 3,
      views: 567,
      comments: 31,
      isUpvoted: false,
      isDownvoted: false,
      createdAt: '1 day ago',
      tags: ['wellness', 'mental-health', 'gym'],
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Create Post */}
      <Card>
        <CardHeader title="Share Anonymous Feedback" />
        <CardContent>
          <TextField
            fullWidth
            placeholder="Enter your feedback title..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind? Your feedback is completely anonymous..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="Policy" variant="outlined" size="small" />
              <Chip label="Workplace" variant="outlined" size="small" />
              <Chip label="Technology" variant="outlined" size="small" />
            </Box>
            <Button variant="contained" startIcon={<Message />}>
              Post Feedback
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}

export default Feed;
