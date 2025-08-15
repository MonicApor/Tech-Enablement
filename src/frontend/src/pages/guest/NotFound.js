import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Button from 'components/atoms/Button';
import Heading from 'components/atoms/Heading';

function NotFound() {
  const { t } = useTranslation();

  return (
    <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
      <Heading variant="h2" align="center" color="text.primary" gutterBottom>
        404 Not Found
      </Heading>
      <Heading variant="h5" align="center" color="text.secondary">
        {t('pages.not_found.sub_heading')}
      </Heading>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Button component={Link} to="/" variant="contained" size="large" disableElevation>
          {t('pages.not_found.back_to_top')}
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
