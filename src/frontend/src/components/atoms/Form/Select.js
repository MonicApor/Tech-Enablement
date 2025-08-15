import PropTypes from 'prop-types';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Textfield from '@mui/material/TextField';

// eslint-disable-next-line no-unused-vars
const Select = React.forwardRef(function Select(props, ref) {
  const { label = '', options = [], error = false, helperText, color = 'primary', ...rest } = props;
  const variant = 'standard';

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
    sx: (theme) => ({
      mt: theme.spacing(3),
      '& legend': { display: 'none' },
      '& fieldset': { top: 0 },
      minHeight: '43px',
    }),
  };

  const selectProps = {
    inputProps: {
      defaultValue: '',
      sx: { p: '0.65rem' },
    },
  };

  const helperTextProps = {
    sx: { mx: 0 },
  };

  return (
    <Textfield
      select
      fullWidth
      label={label}
      InputProps={{ ...inputProps }}
      inputProps={{ ...rest }}
      InputLabelProps={labelProps}
      SelectProps={selectProps}
      error={error}
      helperText={helperText}
      FormHelperTextProps={helperTextProps}
      variant="outlined"
      ref={ref}
    >
      {options.map((option, key) => (
        <MenuItem key={key} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Textfield>
  );
});

Select.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  color: PropTypes.string,
};

export default Select;
