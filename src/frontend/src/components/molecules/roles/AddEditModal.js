import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { searchPermissions } from 'services/permissions.service';
import { createRole, updateRole } from 'services/role.service';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import BodyText from 'components/atoms/BodyText';
import Button from 'components/atoms/Button';
import Checkbox from 'components/atoms/Form/Checkbox';
import TextField from 'components/atoms/Form/TextField';
import Modal from 'components/organisms/Modal';
import errorHandler from 'utils/errorHandler';

function AddEditModal(props) {
  const { role, open, handleClose, handleSaveEvent } = props;

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // form validation
  const schema = yup.object({
    name: yup.string().required(t('form.required')),
    permissions: yup.array().min(0),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  useEffect(() => {
    setLoading(false);

    setTitle(t('pages.roles.add_role'));
    setValue('name', '');

    if (role) {
      // pre-fill the form
      setTitle(t('pages.roles.edit_role'));
      setValue('name', role.name);

      setValue(
        'permissions',
        role.permissions.map((permission) => permission.name)
      );
    }
  }, [role]);

  useEffect(() => {
    if (open) {
      fetchPermissions();
    } else {
      clearErrors();
      reset();
    }
  }, [open]);

  const handleFormSubmit = async (data) => {
    setLoading(true);

    try {
      const response = role ? await updateRole(role.id, data) : await createRole(data);
      reset();
      setLoading(false);
      handleSaveEvent(response);
    } catch (err) {
      errorHandler(err, setError, toast);
    }
  };

  const fetchPermissions = async () => {
    const { data } = await searchPermissions();
    setPermissions(() => [...data]);
  };

  return (
    <Modal open={open} handleClose={handleClose} title={title}>
      <Box sx={{ pt: 2 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid size={{ md: 12 }}>
              <TextField
                {...register('name')}
                error={errors && errors.name ? true : false}
                helperText={errors ? errors?.name?.message : null}
                fullWidth
                label={t('pages.roles.name')}
                name="name"
                type="text"
                size="small"
              />
            </Grid>

            <Grid size={{ md: 12 }}>
              <BodyText
                sx={(theme) => ({
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: 1,
                  fontSize: theme.typography.body2.fontSize,
                  transform: 'none',
                  color: 'rgba(0, 0, 0, 0.6)',
                })}
              >
                {t('pages.roles.permissions')}
              </BodyText>

              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                <Controller
                  name="permissions"
                  control={control}
                  render={({ field }) =>
                    permissions.map((permission) => {
                      const { name } = permission;
                      return (
                        <Checkbox
                          key={name}
                          label={name}
                          value={name}
                          checked={field?.value.some((current) => current === name)}
                          onChange={(event, checked) => {
                            if (checked) {
                              field.onChange([...field.value, event.target.value]);
                            } else {
                              field.onChange(
                                field.value.filter((value) => value !== event.target.value)
                              );
                            }
                          }}
                        />
                      );
                    })
                  }
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', px: 2, pb: 2, gap: 1 }}>
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              {t('labels.cancel')}
            </Button>

            <Button disabled={loading} type="submit">
              {role ? t('labels.update') : t('labels.save')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

AddEditModal.propTypes = {
  open: PropTypes.bool,
  role: PropTypes.object,
  handleSaveEvent: PropTypes.func,
  handleClose: PropTypes.func,
};

export default AddEditModal;
