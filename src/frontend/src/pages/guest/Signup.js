import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProfile } from 'services/profile.service';
import * as yup from 'yup';
import { Box, Card, Container, Grid, Typography } from '@mui/material';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Form/Checkbox';
import TextField from 'components/atoms/Form/TextField';
import PageTitle from 'components/atoms/PageTitle';
import errorHandler from 'utils/errorHandler';

function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // form validation
  const schema = yup.object({
    first_name: yup.string().required(t('form.required')),
    last_name: yup.string().required(t('form.required')),
    email: yup.string().required(t('form.required')).email(t('form.email')),
    accept_terms: yup.bool().oneOf([true], t('form.required')),
  });

  const {
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      checkbox: false,
    },
  });

  const handleSignUp = async (data) => {
    try {
      await createProfile(data);
      toast(t('pages.signup.signup_complete'), { type: 'success' });
      reset();
    } catch (err) {
      errorHandler(err, setError, toast);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 8 }}>
      <Card sx={{ p: 4 }}>
        <PageTitle title={t('pages.signup.create_free_account')} />

        <Box component="form" noValidate onSubmit={handleSubmit(handleSignUp)} sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {t('pages.signup.signup_description')}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('first_name')}
                error={errors && errors.first_name ? true : false}
                helperText={errors ? errors?.first_name?.message : null}
                name="first_name"
                fullWidth
                id="first_name"
                label={t('labels.first_name')}
                type="text"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register('last_name')}
                error={errors && errors.last_name ? true : false}
                helperText={errors ? errors?.last_name?.message : null}
                fullWidth
                id="last_name"
                label={t('labels.last_name')}
                name="last_name"
                type="text"
                size="small"
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
                size="small"
              />
            </Grid>

            <Grid size={12}>
              <Checkbox
                {...register('accept_terms')}
                label={
                  <Typography color="text.secondary" variant="body2">
                    {t('pages.signup.agree_to_terms')}{' '}
                    <Link to="/terms" target="_blank">
                      {t('pages.signup.terms_conditions')}
                    </Link>
                  </Typography>
                }
                error={errors && errors.accept_terms ? true : false}
                helperText={errors ? errors?.accept_terms?.message : null}
              />
            </Grid>

            <Grid size={12}>
              <Button fullWidth type="submit">
                {t('labels.signup')}
              </Button>
            </Grid>
            <Grid size={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('pages.signup.already_have_account')}
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                >
                  {t('pages.signup.sign_in_here')}
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Container>
  );
}

export default Signup;
