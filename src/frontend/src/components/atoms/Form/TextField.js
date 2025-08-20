import PropTypes from 'prop-types';
import * as React from 'react';
import { TextField as MuiTextField } from '@mui/material';

const TextField = React.forwardRef(function TextField(props, ref) {
  const {
    color = 'primary',
    InputProps,
    error = false,
    fullWidth = true,
    noLabel = false,
    disabled = false,
    ...rest
  } = props;
  let { variant } = props;
  // force variant to use 'standard'
  variant = 'standard';

  const labelProps = {
    color,
    shrink: true,
    variant,
    error,
    sx: (theme) => ({
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: 1,
      fontSize: theme.typography.body2.fontSize,
      transform: 'none',
    }),
  };

  const inputProps = {
    disableUnderline: true,
    sx: (theme) => ({
      borderRadius: 1,
      background: 'white',
      fontSize: theme.typography.body1.fontSize,
      border: `1px solid ${error ? theme.palette.error.main : theme.palette.grey[400]}`,
      '&:active, &:focus, &:hover': {
        border: `1px solid ${theme.palette[color].main}`,
      },
      py: 0.75,
      px: 1,
      minHeight: '42px',
      mt: noLabel ? '0px' : `${theme.spacing(3)} !important`,
    }),
  };

  return (
    <MuiTextField
      InputLabelProps={labelProps}
      InputProps={{ ...inputProps, ...InputProps }}
      variant={variant}
      ref={ref}
      error={error}
      color={color}
      fullWidth={fullWidth}
      disabled={disabled}
      {...rest}
      sx={(theme) => ({
        '& .MuiInputBase-input.Mui-disabled': {
          background: theme.palette.grey[200],
          minHeight: 0,
        },
        '& .MuiInputBase-root': {
          background: disabled ? theme.palette.grey[200] : 'none',
        },
      })}
    />
  );
});

TextField.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  error: PropTypes.bool,
  InputProps: PropTypes.any,
  fullWidth: PropTypes.bool,
  noLabel: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default TextField;
