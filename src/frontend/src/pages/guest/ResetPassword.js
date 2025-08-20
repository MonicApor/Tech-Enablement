import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'hooks/useQuery';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from 'services/password.service';
import * as yup from 'yup';
import { Box, Card, Container, Grid } from '@mui/material';
import Button from 'components/atoms/Button';
import PasswordField from 'components/atoms/Form/PasswordField';
import PageTitle from 'components/atoms/PageTitle';
import api from 'utils/api';
import errorHandler from 'utils/errorHandler';

function ResetPassword() {
  const query = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(() => query.get('token'));
    if (token) verifyToken();
  }, [token]);

  // form validation
  const schema = yup.object({
    password: yup
      .string()
      .required(t('form.required'))
      .min(8, t('form.password.minLength'))
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        t('form.password.strong')
      ),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], t('form.password.confirm')),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleReset = async (data) => {
    const { password, password_confirmation } = data;

    try {
      await resetPassword(token, password, password_confirmation);
      navigate('/login');
      toast(t('pages.reset_password.success'), {
        type: 'success',
      });
    } catch (err) {
      errorHandler(err, setError, toast);
    }
  };

  const verifyToken = async () => {
    const query = new URLSearchParams({ type: 'password_reset', token }).toString();

    return await api.get(`/token/verify?${query}`).catch(() => navigate('/page-not-found'));
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 8 }}>
      <PageTitle
        title={t('labels.reset_password')}
        subTitle={t('pages.reset_password.sub_heading')}
      />

      <Card sx={{ p: 4 }}>
        <Box component="form" noValidate onSubmit={handleSubmit(handleReset)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <PasswordField
                {...register('password')}
                error={errors && errors.password ? true : false}
                helperText={errors ? errors?.password?.message : null}
                fullWidth
                label={t('labels.new_password')}
                name="password"
              />
            </Grid>

            <Grid size={12}>
              <PasswordField
                {...register('password_confirmation')}
                error={errors && errors.password_confirmation ? true : false}
                helperText={errors ? errors?.password_confirmation?.message : null}
                fullWidth
                label={t('labels.confirm_new_password')}
                name="password_confirmation"
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

export default ResetPassword;
