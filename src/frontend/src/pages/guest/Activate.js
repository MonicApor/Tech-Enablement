import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from 'hooks/useQuery';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Box, Card, Container, Grid } from '@mui/material';
import Button from 'components/atoms/Button';
import PasswordField from 'components/atoms/Form/PasswordField';
import PageTitle from 'components/atoms/PageTitle';
import api from 'utils/api';

function Activate() {
  const query = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [token, setToken] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleActivate = async (data) => {
    const { password, password_confirmation } = data;
    setLoading(true);

    return await api
      .post('/auth/activate', { token, password, password_confirmation })
      .then(() => {
        setLoading(false);
        toast(t('pages.activate.activated'), {
          type: 'success',
        });
        setTimeout(() => {
          window.location = '/login';
        }, 500);
      })
      .catch((err) => {
        const { message } = err.response.data;
        toast(message, { type: 'error' });
        setLoading(false);
      });
  };

  const verifyToken = async () => {
    return await api
      .post(`/auth/verify-token`, { token, type: 'activation' })
      .then(({ data }) => {
        const { valid } = data;
        setValid(valid);
      })
      .catch(() => navigate('/page-not-found'));
  };

  return (
    <>
      {valid && (
        <Container maxWidth="sm" sx={{ pt: 8 }}>
          <PageTitle title={t('pages.activate.heading')} subTitle={t('pages.activate.subtitle')} />

          <Card sx={{ p: 4 }}>
            <Box component="form" noValidate onSubmit={handleSubmit(handleActivate)}>
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
                    label={t('labelsa.confirm_new_password')}
                    name="password_confirmation"
                  />
                </Grid>

                <Grid size={12}>
                  <Button type="submit" fullWidth disabled={loading}>
                    {t('labels.submit')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Container>
      )}
    </>
  );
}

export default Activate;
