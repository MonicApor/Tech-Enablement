import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';

function CallToAction() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, md: 8 } }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('pages.landing.call_to_action')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          {t('pages.landing.call_to_action_description')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/signup')}
          sx={{
            backgroundColor: 'secondary.main',
            '&:hover': { backgroundColor: 'secondary.dark' },
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
          }}
        >
          {t('pages.landing.call_to_action_button')}
        </Button>
      </Container>
    </Box>
  );
}

export default CallToAction;
