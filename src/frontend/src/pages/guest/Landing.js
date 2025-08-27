import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Analytics, Feedback, Security } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Button as MuiButton,
  Typography,
} from '@mui/material';
import ButtonRound from 'components/atoms/ButtonRound';
import HeroImage from 'components/atoms/HeroImage';
import Section from 'components/atoms/Section';
import CallToAction from 'components/molecules/CallToAction';
import ReviewSlider from 'components/molecules/ReviewSlider';
import Seo from 'components/organisms/Seo';

function Landing() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Security sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: t('pages.landing.docker.heading'),
      description: t('pages.landing.docker.description'),
    },
    {
      icon: <Feedback sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: t('pages.landing.react.heading'),
      description: t('pages.landing.react.description'),
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: t('pages.landing.laravel.heading'),
      description: t('pages.landing.laravel.description'),
    },
  ];

  {
    /** dummy client data */
  }
  const clients = [...Array(6)].map((item, index) => {
    index++;
    return {
      name: `Client ${index}`,
      logo: `/static/images/client-logo-${index}.png`,
    };
  });

  {
    /** dummy reviews data */
  }
  const reviews = [...Array(9)].map(() => ({
    avatar: faker.image.people(120, 120, true),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    comment: faker.lorem.words(15),
    rating: Math.random() * (5 - 1) + 1,
  }));

  return (
    <>
      <Seo
        title="Sprobe Base Template"
        description="This is a boilerplate for React + Laravel Applications."
        image="http://test.com/"
      />

      <HeroImage image="/static/images/bg-hero2.png" height="calc(70vh - 64px)">
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'white', textShadow: '2px 2px rgba(0, 0, 0, 0.5)' }}
            >
              {t('pages.landing.main_heading')}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              component="p"
              sx={{ color: 'white' }}
            >
              {t('pages.landing.sub_heading')}
            </Typography>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <ButtonRound component={Link} to="/signup" disableElevation>
                {t('labels.get_started')}
              </ButtonRound>
            </Box>
          </Box>
        </Box>
      </HeroImage>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, color: 'text.primary' }}
        >
          {t('pages.landing.why_heading')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                elevation={2}
                sx={{
                  width: '100%',
                  maxWidth: 320,
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/** Our Clients */}
      <Section heading={t('pages.landing.our_customers_heading')} background="white">
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={8}>
            {clients.map((client, key) => (
              <Grid size={{ xs: 12, sm: 4, md: 2 }} key={key}>
                <Box
                  component="img"
                  alt={client.name}
                  src={client.logo}
                  sx={{ width: '100%', m: '0 auto' }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      {/** Reviews */}
      <Section heading={t('pages.landing.reviews_heading')} fullWidth={true}>
        <ReviewSlider reviews={reviews} sx={{ mt: 6, p: 4 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <MuiButton variant="outlined">{t('pages.landing.see_all_reviews')}</MuiButton>
        </Box>
      </Section>

      {/** CTA */}
      <CallToAction />
    </>
  );
}

export default Landing;
