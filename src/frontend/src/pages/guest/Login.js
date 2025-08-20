import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, loginWithMicrosoft } from 'services/auth';
import * as yup from 'yup';
import { Box, Card, Container, Divider, Grid, Link, Typography } from '@mui/material';
import Button from 'components/atoms/Button';
import PasswordField from 'components/atoms/Form/PasswordField';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';

function Login() {
  const { t } = useTranslation();
  const location = useLocation();
  const user = useSelector((state) => state.profile.user);

  // form validation
  const schema = yup.object({
    username: yup.string().required(t('form.required')).email(t('form.email')),
    password: yup.string().required(t('form.required')),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { checkbox: false },
  });

  useEffect(() => {
    if (user) {
      const { role } = user;
      const redirect = role === 'System Admin' ? '/admin/' : '/';
      // use native redirect to avoid ui glitch on state change
      window.location = redirect;
    }
  }, [user]);

  const handleLogin = async (data) => {
    const { username, password } = data;
    await login({ username, password, setError })
      .then(async (user) => {
        const { role } = user;
        let redirect = '';

        switch (role) {
          case 'System Admin':
            redirect = '/admin';
            break;
          default:
            redirect = '/employee';
            break;
        }
        const query = new URLSearchParams(location.search);
        // use native redirect to avoid ui glitch on state change
        window.location = query.get('redirect_to') ?? redirect;
      })
      .catch((err) => {
        const { message } = err.response.data;
        toast(message, { type: 'error' });
      });
  };

  const handleMicrosoftLogin = async () => {
    try {
      const user = await loginWithMicrosoft();
      const { role } = user;
      let redirect = '';

      switch (role) {
        case 'System Admin':
          redirect = '/admin';
          break;
        default:
          redirect = '/employee';
          break;
      }
      const query = new URLSearchParams(location.search);
      window.location = query.get('redirect_to') ?? redirect;
    } catch (error) {
      console.error('Microsoft login failed:', error);
      toast('Microsoft 365 login failed. Please try again.', { type: 'error' });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ pt: 8 }}>
      <Card sx={{ p: 4 }}>
        <PageTitle title={t('labels.login')} />

        {/* Microsoft 365 Sign In */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleMicrosoftLogin}
            sx={{
              mb: 2,
              color: '#0078d4',
              borderColor: '#0078d4',
              '&:hover': {
                backgroundColor: '#f3f2f1',
                borderColor: '#106ebe',
              },
            }}
          >
            🏢 Sign in with Microsoft 365
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              or continue with email
            </Typography>
          </Divider>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit(handleLogin)} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                {...register('username')}
                error={errors && errors.username ? true : false}
                helperText={errors ? errors?.username?.message : null}
                fullWidth
                label={t('labels.email_address')}
                name="username"
                type="text"
              />
            </Grid>

            <Grid size={12}>
              <PasswordField
                {...register('password')}
                error={errors && errors.password ? true : false}
                helperText={errors ? errors?.password?.message : null}
                fullWidth
                label={t('labels.password')}
                name="password"
              />
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit">
                {t('labels.login')}
              </Button>
            </Grid>

            <Grid size={12}>
              <Link
                component={RouterLink}
                variant="subtitle2"
                to="/forgot-password"
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                  textDecoration: 'none',
                }}
              >
                {t('labels.forgot_password')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}

export default Login;
