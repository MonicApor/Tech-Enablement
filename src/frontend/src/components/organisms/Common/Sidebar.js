import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  List,
  ListSubheader,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SidebarMenu } from 'components//molecules/SidebarMenu';

function Sidebar() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        height: isMobile ? 'auto' : '100vh',
        overflowY: isMobile ? 'visible' : 'auto',
      }}
    >
      <Card
        sx={{
          height: isMobile ? 'auto' : '100vh',
          boxShadow: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 1,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <List
            sx={{ width: '100%' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{
                  bgcolor: 'inherit',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: isMobile ? 2 : 1,
                }}
              >
                {t('sidebar.employee')}
              </ListSubheader>
            }
          >
            <SidebarMenu />
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Sidebar;
