import React from 'react';
import { AccessTime } from '@mui/icons-material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import { Box, Card, CardContent, CardHeader, Chip, Typography } from '@mui/material';

function Rightbar() {
  const trendingTopics = [
    { topic: 'Remote Work', posts: 24 },
    { topic: 'Team Communication', posts: 18 },
    { topic: 'Office Environment', posts: 12 },
    { topic: 'Professional Development', posts: 9 },
  ];

  const recentActivity = [
    { action: 'New feedback on Meeting Culture', time: '5 min ago' },
    { action: 'Policy update discussion', time: '1 hour ago' },
    { action: 'Weekly feedback summary', time: '2 hours ago' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Trending Topics */}
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
            {trendingTopics.map((topic, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {topic.topic}
                </Typography>
                <Chip label={topic.posts} size="small" variant="outlined" />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Activity */}
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
            {recentActivity.map((activity, index) => (
              <Box key={index}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {activity.action}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Rightbar;
