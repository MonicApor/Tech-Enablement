import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Checkbox as MuiCheckbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';

const Checkbox = forwardRef(function Checkbox(props, ref) {
  const { label = '', error = false, color = 'primary', helperText = '', ...rest } = props;

  return (
    <FormGroup>
      <FormControlLabel
        label={label}
        control={<MuiCheckbox ref={ref} color={color} {...rest} />}
        error={error.toString()}
      />
      {error && <FormHelperText error={true}>{helperText}</FormHelperText>}
    </FormGroup>
  );
});

Checkbox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.any,
  color: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.any,
};

export default Checkbox;
