import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import HeroImage from 'components/atoms/HeroImage';
import PageTitle from 'components/atoms/PageTitle';
import Youtube from 'components/atoms/Youtube';
import MemberList from 'components/molecules/MemberList';
import QuiltedImageList from 'components/molecules/QuiltedImageList';

function About() {
  const { t } = useTranslation();

  const members = [...Array(6)].map(() => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    avatar:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVzZXI8L3RleHQ+PC9zdmc+',
    role: faker.name.jobTitle(),
  }));

  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const images = [...Array(24)].map(() => ({
    alt: faker.lorem.words(3),
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFjdGl2aXR5PC90ZXh0Pjwvc3ZnPg==',
    rows: random(1, 2),
    cols: random(1, 2),
  }));

  return (
    <>
      <Container disableGutters component="section" sx={{ pt: 8, pb: 6 }}>
        <PageTitle title={t('pages.about.main_heading')} subTitle={t('pages.about.sub_heading')} />
      </Container>

      {/** Cover */}
      <HeroImage
        image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2NjY2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IZXJvIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
        height="300px"
      />

      {/** Staff */}
      <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 12, pb: 6 }}>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('pages.about.meet_the_team')}
        </Typography>
        <BodyText align="center">{t('pages.about.team_description')}</BodyText>
      </Container>

      <Container maxWidth="lg" sx={{ pb: 12 }}>
        <MemberList members={members} />
      </Container>

      <Box component="section" sx={{ mt: 6, py: 12, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Typography
                  component="h5"
                  variant="h5"
                  color="text.primary"
                  sx={{ mb: 4, fontWeight: 'bold' }}
                >
                  {t('pages.about.our_mission')}
                </Typography>
                <BodyText>{t('pages.about.mission_description')}</BodyText>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Youtube videoId="mocuGRf2UVg" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/** Masonry */}
      <Container disableGutters maxWidth="sm" component="section" sx={{ pt: 12, pb: 6 }}>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          {t('pages.about.our_activities')}
        </Typography>
        <BodyText align="center">{t('pages.about.activities_description')}</BodyText>

        <QuiltedImageList images={images} />
      </Container>
    </>
  );
}

export default About;
