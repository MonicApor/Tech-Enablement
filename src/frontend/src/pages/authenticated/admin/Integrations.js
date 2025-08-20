import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';

function Integrations() {
  const { t } = useTranslation();

  const integrations = [
    {
      name: 'Backlog',
      category: 'Project Management',
      image: '/static/images/backlog.svg',
    },
    {
      name: 'Gitlab',
      category: 'Source Control',
      image: '/static//images/gitlab.svg',
    },
    {
      name: 'Slack',
      category: 'Communication',
      image: '/static/images/slack.svg',
    },
  ];

  return (
    <Container disableGutters component="main" sx={{ pt: 4, pb: 6 }}>
      <PageTitle title={t('labels.integrations')} />

      <Grid container spacing={4}>
        {integrations.map((app, key) => (
          <Grid size={{ xs: 4 }} key={key}>
            <Card>
              <CardMedia component="img" height="200" image={app.image} alt={app.name} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {app.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">{t('labels.settings')}</Button>
                <Button size="small">{t('labels.documentation')}</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Integrations;
