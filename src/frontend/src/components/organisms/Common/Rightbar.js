import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentActivities, useTrendingTopics } from 'services/post.service';
import { AccessTime, Article, Category, Comment, Flag, Reply, ThumbUp } from '@mui/icons-material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import { Box, Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';

function Rightbar() {
  const { trendingTopics, isLoading, error } = useTrendingTopics();
  const { recentActivities } = useRecentActivities();

  const navigate = useNavigate();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Post':
        return <Article sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'Comment':
        return <Comment sx={{ fontSize: 16, color: 'info.main' }} />;
      case 'HrReply':
        return <Reply sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'FlaggedPost':
        return <Flag sx={{ fontSize: 16, color: 'error.main' }} />;
      default:
        return <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />;
    }
  };

  const getActivityTitle = (activity) => {
    switch (activity.type) {
      case 'Post':
        return activity.title;
      case 'Comment':
        return `Commented: ${activity.body?.substring(0, 50)}${
          activity.body?.length > 50 ? '...' : ''
        }`;
      case 'HrReply':
        return `HR Reply: ${activity.body?.substring(0, 50)}${
          activity.body?.length > 50 ? '...' : ''
        }`;
      case 'FlaggedPost':
        return `Flagged: ${activity.title}`;
      default:
        return activity.body || 'Unknown activity';
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case 'Post':
      case 'FlaggedPost':
        navigate(`/posts/${activity.id}`);
        break;
      case 'Comment':
      case 'HrReply':
        navigate(`/posts/${activity.post_id}`);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
              Trending Topics
            </Box>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading trending topics...
              </Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                Error loading trending topics
              </Typography>
            ) : trendingTopics && trendingTopics.length > 0 ? (
              trendingTopics.map((topic, index) => (
                <Box
                  key={topic.id || index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => navigate(`/posts/${topic.id}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ minWidth: 40 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        flex: 1,
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {topic.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ThumbUp sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {topic.upvotes_count || 0}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Comment sx={{ fontSize: 16, color: 'info.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        {topic.comments_count || 0}
                      </Typography>
                    </Box>

                    {topic.category && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Category sx={{ fontSize: 16, color: 'warning.main' }} />
                        <Typography variant="caption" color="text.secondary">
                          {topic.category.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ ml: 5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Posted: {topic.created_at_human}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No trending topics available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, fontSize: 20 }} />
              Recent Activity
            </Box>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {isLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading recent activities...
              </Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                Error loading recent activities
              </Typography>
            ) : recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <Box
                  key={`${activity.type}-${activity.id}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 1.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handleActivityClick(activity)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    {getActivityIcon(activity.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' },
                          lineHeight: 1.4,
                        }}
                      >
                        {getActivityTitle(activity)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activities available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Rightbar;
