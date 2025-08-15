import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Box, Card, Container, Grid } from '@mui/material';
import Button from 'components/atoms/Button';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';
import api from 'utils/api';

function Inquiry() {
  const { t } = useTranslation();

  // form validation
  const schema = yup.object({
    fullname: yup.string().required(t('form.required')),
    email: yup.string().required(t('form.required')).email(t('form.email')),
    inquiry_content: yup.string().required(t('form.required')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleInquiry = async (data) => {
    const { fullname, email, inquiry_content: content } = data;
    await api
      .post('/inquiries', { fullname, email, content })
      .then(() => {
        toast(t('pages.inquiry.success_message'), { type: 'success' });
        reset(); // clear form
      })
      .catch(() => {
        toast(t('pages.inquiry.failed_message'), { type: 'error' });
      });
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 8 }}>
      <PageTitle title={t('pages.inquiry.heading')} subTitle={t('pages.inquiry.sub_heading')} />

      <Card sx={{ p: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit(handleInquiry)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                {...register('fullname')}
                error={errors && errors.fullname ? true : false}
                helperText={errors ? errors?.fullname?.message : null}
                fullWidth
                id="fullname"
                label={t('labels.fullname')}
                name="fullname"
                type="text"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                {...register('email')}
                error={errors && errors.email ? true : false}
                helperText={errors ? errors?.email?.message : null}
                fullWidth
                label={t('labels.email_address')}
                name="email"
                type="text"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                {...register('inquiry_content')}
                error={errors && errors.inquiry_content ? true : false}
                helperText={errors ? errors?.inquiry_content?.message : null}
                fullWidth
                label={t('labels.inquiry_content')}
                name="inquiry_content"
                multiline
                rows={4}
                type="text"
              />
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit">
                {t('labels.submit')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}

export default Inquiry;
