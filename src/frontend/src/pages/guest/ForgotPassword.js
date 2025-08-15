import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from 'services/password.service';
import * as yup from 'yup';
import { Box, Card, Container, Grid } from '@mui/material';
import Button from 'components/atoms/Button';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';
import errorHandler from 'utils/errorHandler';

function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // form validation
  const schema = yup.object({
    email: yup.string().required(t('form.required')).email(t('form.email')),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm({ resolver: yupResolver(schema) });

  const handleForgot = async (data) => {
    try {
      const { email } = data;
      await forgotPassword(email);
      reset();
      navigate('/login');
      toast(t('pages.forgot_password.success'), { type: 'success' });
    } catch (err) {
      errorHandler(err, setError, toast);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 8 }}>
      <PageTitle
        title={t('labels.forgot_password')}
        subTitle={t('pages.forgot_password.sub_heading')}
      />

      <Card sx={{ p: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit(handleForgot)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
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

export default ForgotPassword;
