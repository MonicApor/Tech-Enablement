import { useTranslation } from 'react-i18next';
import { Box, Container, Grid } from '@mui/material';
import LineChart from 'components/atoms/LineChart';
import NumberWidget from 'components/atoms/NumberWidget';
import PageTitle from 'components/atoms/PageTitle';

function Dashboard() {
  const { t } = useTranslation();

  const widgets = [
    { label: t('pages.dashboard.new_users'), value: 35 },
    {
      label: t('pages.dashboard.total_sales'),
      value: 35750,
    },
    {
      label: t('pages.dashboard.total_orders'),
      value: 540,
    },
  ];

  return (
    <Container disableGutters component="main" sx={{ pt: 4, pb: 6 }}>
      <PageTitle
        title={t('pages.dashboard.main_heading')}
        subTitle={t('pages.dashboard.sub_heading')}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={4}>
          {widgets.map((widget, key) => {
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                <NumberWidget label={widget.label} value={widget.value} />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Static Line Chart For Demo Purposes */}
      <LineChart />
    </Container>
  );
}

export default Dashboard;
