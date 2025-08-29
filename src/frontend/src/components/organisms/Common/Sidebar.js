// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  BarChart,
  Chat as ChatIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';

function Sidebar() {
  const navigate = useNavigate();
  // const { t } = useTranslation();

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
      <CardHeader title="Quick Actions" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            New Feedback
          </Button>
          <Button
            variant="outline"
            startIcon={<BarChart />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              backgroundColor: 'transparent',
            }}
          >
            Analytics
          </Button>
          <Button
            variant="outline"
            startIcon={<GroupIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              backgroundColor: 'transparent',
            }}
          >
            Team Insights
          </Button>
          <Button
            variant="outline"
            startIcon={<ChatIcon />}
            onClick={() => navigate('/employee/chats')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              backgroundColor: 'transparent',
            }}
          >
            Conversations
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Sidebar;
