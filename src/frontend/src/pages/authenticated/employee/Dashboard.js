import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <Container disableGutters component="main" sx={{ pt: 4, pb: 6 }}>
      <PageTitle
        title={t('pages.dashboard.main_heading')}
        subTitle={t('pages.dashboard.sub_heading')}
      />
    </Container>
  );
}

export default Dashboard;
