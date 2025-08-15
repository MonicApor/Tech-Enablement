import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { RadioGroup as MuiRadioGroup } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';

const RadioGroup = forwardRef(function RadioGroup(props, ref) {
  const {
    label = '',
    options,
    error = false,
    helperText,
    defaultValue = '',
    inline = false, //  Horizonal or Vertical List type
    ...rest
  } = props;

  const labelStyles = {
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1,
    fontSize: 12,
  };

  return (
    <FormControl>
      <FormLabel sx={labelStyles} error={error}>
        {label}
      </FormLabel>
      <MuiRadioGroup defaultValue={defaultValue} row={inline}>
        {options.map((option, key) => (
          <FormControlLabel
            control={<Radio ref={ref} value={option.value} {...rest} />}
            label={option.label}
            key={key}
          />
        ))}
      </MuiRadioGroup>
      {error && (
        <FormHelperText error={error} sx={{ mx: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

RadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  inline: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.any,
};

export default RadioGroup;
