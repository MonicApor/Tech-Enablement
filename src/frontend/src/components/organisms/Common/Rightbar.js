import React from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

const Rightbar = () => {
  // Mock trending posts data (replace with actual API call)
  const trendingPosts = [
    {
      id: 1,
      title: 'New Office Policy Implementation',
      author: 'John Smith',
      authorAvatar:
        'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&w=1000&q=80',
      upvotes: 127,
      comments: 23,
      views: 456,
      category: 'Policy',
      timeAgo: '2 hours ago',
    },
    {
      id: 2,
      title: 'Remote Work Best Practices',
      author: 'Sarah Johnson',
      authorAvatar: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_1280.jpg',
      upvotes: 89,
      comments: 15,
      views: 234,
      category: 'Workplace',
      timeAgo: '4 hours ago',
    },
    {
      id: 3,
      title: 'Team Building Event Ideas',
      author: 'Mike Chen',
      authorAvatar:
        'https://media.istockphoto.com/id/1093110112/photo/picturesque-morning-in-plitvice-national-park.jpg',
      upvotes: 67,
      comments: 12,
      views: 189,
      category: 'Events',
      timeAgo: '6 hours ago',
    },
    {
      id: 4,
      title: 'IT Support Process Improvements',
      author: 'Lisa Wang',
      authorAvatar:
        'https://www.befunky.com/images/prismic/1f427434-7ca0-46b2-b5d1-7d31843859b6_funky-focus-red-flower-field-after.jpeg',
      upvotes: 54,
      comments: 8,
      views: 145,
      category: 'IT',
      timeAgo: '8 hours ago',
    },
    {
      id: 5,
      title: 'Employee Wellness Program',
      author: 'David Brown',
      authorAvatar: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      upvotes: 43,
      comments: 6,
      views: 123,
      category: 'Wellness',
      timeAgo: '12 hours ago',
    },
  ];

  return (
    <Box flex={2} p={2} sx={{ display: { xs: 'none', lg: 'block' } }}>
      <Box position="fixed" width={520} sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight={600}>
                Trending Posts
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {trendingPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar src={post.authorAvatar} alt={post.author} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 0.5 }}>
                          {post.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            by {post.author} • {post.timeAgo}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <Chip
                              label={post.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ThumbUpIcon fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {post.upvotes}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CommentIcon fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {post.comments}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <VisibilityIcon fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {post.views}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < trendingPosts.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
        {/* Recent Activity */}
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Recent Activity
            </Typography>
            <List sx={{ p: 0 }}>
              {[
                { text: 'New post created in Policy', time: '5 min ago' },
                { text: 'Comment added to Remote Work', time: '12 min ago' },
                { text: 'Upvote on Team Building', time: '18 min ago' },
                { text: 'New user joined', time: '25 min ago' },
                { text: 'Post shared in IT', time: '32 min ago' },
              ].map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          {activity.text}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < 4 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Rightbar;
