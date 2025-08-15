import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BodyText from 'components/atoms/BodyText';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Form/Checkbox';
import DatePicker from 'components/atoms/Form/DatePicker';
import RadioGroup from 'components/atoms/Form/RadioGroup';
import Select from 'components/atoms/Form/Select';
import TextField from 'components/atoms/Form/TextField';
import Heading from 'components/atoms/Heading';

function FormValidationDemo() {
  const { t } = useTranslation();

  const gender = [
    { label: 'Please Select', value: '' },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  // Define your Validation Rules
  const schema = yup.object({
    first_name: yup.string().required(t('form.required')),
    last_name: yup.string().required(t('form.required')),
    email: yup.string().required(t('form.required')).email(t('form.email')),
    about: yup.string().required(t('form.required')),
    gender: yup.string().required(t('form.required')).nullable(),
    subscribe: yup.string().required(t('form.required')).nullable(),
    accept_terms: yup.bool().oneOf([true], t('form.required')),
    attachment: yup
      .mixed()
      .test('required', t('form.required'), (value) => {
        return value && value.length;
      })
      .test('fileSize', 'The file is too large.', (value) => {
        return value && value[0] && value[0].size <= 200000;
      })
      .test('type', 'Only Images are allowed.', function (value) {
        return (
          value && value[0] && ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type)
        );
      }),
    birthday: yup
      .date()
      .required(t('form.required'))
      .typeError('Please select a valid date')
      .nullable(),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { accept_terms: false, birthday: null },
  });

  const handleSignUp = (data) => alert(JSON.stringify(data, null, 4));

  return (
    <Box sx={{ mb: 8, width: '100%' }}>
      <Box sx={{ mb: 8 }}>
        <Heading variant="h4" align="center">
          Form Validation
        </Heading>

        <BodyText>
          Our Base Template uses{' '}
          <Link to="https://react-hook-form.com/get-started" target="_blank">
            React Hook Form
          </Link>{' '}
          together with{' '}
          <Link to="https://github.com/jquense/yup#getting-started" target="_blank">
            Yup Schema Validation
          </Link>{' '}
          for Form Data validation.
        </BodyText>

        <BodyText>
          Below is a sample Form Validation demo utilizing our custom Components. You can check the
          source code in{' '}
          <strong>frontend/src/components/molecules/styleguide/FormValidationDemo.js</strong>
        </BodyText>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit(handleSignUp)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="First Name"
              {...register('first_name')}
              error={errors && errors.first_name ? true : false}
              helperText={errors ? errors?.first_name?.message : null}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Last Name"
              {...register('last_name')}
              error={errors && errors.last_name ? true : false}
              helperText={errors ? errors?.last_name?.message : null}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email Address"
              {...register('email')}
              error={errors && errors.email ? true : false}
              helperText={errors ? errors?.email?.message : null}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Select
              label="Gender"
              options={gender}
              {...register('gender')}
              error={errors && errors.gender ? true : false}
              helperText={errors ? errors?.gender?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <DatePicker
              name="birthday"
              control={control}
              label="Birthday"
              format="YYYY/MM/DD"
              error={errors && errors.birthday ? true : false}
              helperText={errors ? errors?.birthday?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="About Me"
              multiline
              minRows={4}
              fullWidth
              {...register('about')}
              error={errors && errors.about ? true : false}
              helperText={errors ? errors?.about?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Attachment"
              type="file"
              fullWidth
              {...register('attachment')}
              error={errors && errors.attachment ? true : false}
              helperText={errors ? errors?.attachment?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <RadioGroup
              label="Subsribe to NewsLetter"
              options={options}
              inline={true}
              {...register('subscribe')}
              error={errors && errors.subscribe ? true : false}
              helperText={errors ? errors?.subscribe?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <Checkbox
              label="I agree to the Terms and Conditions"
              {...register('accept_terms')}
              error={errors && errors.accept_terms ? true : false}
              helperText={errors ? errors?.accept_terms?.message : null}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ float: 'right' }}>
              <Button type="submit">Submit</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default FormValidationDemo;
