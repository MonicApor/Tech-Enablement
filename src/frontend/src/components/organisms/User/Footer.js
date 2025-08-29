import { useTranslation } from 'react-i18next';
import { Box, Button, Container, Grid, Typography } from '@mui/material';

function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        py: 4,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anon-removebg-preview-0Xgl9VUadY2fLQy9CidNBnA6DMPm9l.png"
                alt="Anon Logo"
                style={{ height: 32, marginRight: 12 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Anon
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {t('pages.landing.sub_heading')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {t('menu.quick_links')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                {t('menu.privacy_policy')}
              </Button>
              <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                {t('menu.terms')}
              </Button>
              <Button size="small" sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                {t('menu.support')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
