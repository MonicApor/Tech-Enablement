import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, List, ListSubheader } from '@mui/material';
import { SidebarMenu } from 'components//molecules/SidebarMenu';

function Sidebar() {
  const { t } = useTranslation();
  return (
    <Box flex={1} sx={{ display: { xs: 'none', sm: 'block' } }}>
      <Box position="fixed" width={280} sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Card sx={{ height: '100vh', boxShadow: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List
              sx={{ width: '100%' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  sx={{ bgcolor: 'inherit', fontWeight: 600, fontSize: '1.1rem' }}
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
    </Box>
  );
}

export default Sidebar;
