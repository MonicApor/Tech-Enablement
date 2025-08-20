import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Box, Container } from '@mui/material';
import Button from 'components/atoms/Button';
import Heading from 'components/atoms/Heading';

export default function Unauthorized() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.profile.user);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    if (user) {
      const { role } = user;
      switch (role) {
        case 'System Admin':
          setRedirect('/admin');
          break;
        default:
          setRedirect('/');
          break;
      }
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Heading variant="h2" align="center" color="text.primary" gutterBottom>
          403 {t('pages.unauthorized.main_heading')}
        </Heading>
        <Heading variant="h5" align="center" color="text.secondary">
          {t('pages.unauthorized.sub_heading')}
        </Heading>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button
            onClick={() => (window.location = redirect)}
            variant="contained"
            size="large"
            disableElevation
          >
            {t('pages.not_found.back_to_top')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
