import { faker } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';
import Accordion from 'components/molecules/Accordion';

function Faq() {
  const { t } = useTranslation();

  const questions = [...Array(10)].map(() => ({
    header: `${faker.lorem.words(5)}?`,
    content: faker.lorem.paragraphs(2, '\n'),
  }));

  return (
    <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 6 }}>
      <PageTitle title={t('pages.faq.heading')} subTitle={t('pages.faq.sub_heading')} />

      <Accordion items={questions} />
    </Container>
  );
}

export default Faq;
