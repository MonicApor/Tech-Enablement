import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Add as AddIcon, Chat as ChatIcon, Flag, Group as GroupIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardHeader } from '@mui/material';

function Sidebar() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.profile.user);
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Card sx={{ boxShadow: 2, borderRadius: 1 }}>
      <CardHeader title={t('sidebarANON.title')} />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant={location.pathname === '/employee' ? 'contained' : 'outline'}
            startIcon={<AddIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              backgroundColor: location.pathname === '/employee' ? undefined : 'transparent',
            }}
            onClick={() => navigate('/employee')}
          >
            {t('sidebarANON.new_feedback')}
          </Button>
          {currentUser && currentUser.role_id === 2 && (
            <Button
              variant="outline"
              startIcon={<Flag />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                backgroundColor: 'transparent',
              }}
              onClick={() => navigate('/employee/flag-post')}
            >
              {t('FlaggedPostsANON.title')}
            </Button>
          )}
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
            variant={location.pathname === '/employee/chats' ? 'contained' : 'outline'}
            startIcon={<ChatIcon />}
            onClick={() => navigate('/employee/chats')}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              backgroundColor: location.pathname === '/employee/chats' ? undefined : 'transparent',
            }}
          >
            {t('sidebarANON.chats')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Sidebar;
