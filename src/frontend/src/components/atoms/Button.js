import PropTypes from 'prop-types';
import * as React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(MuiButton)(({ theme }) => ({
  padding: `${theme.spacing(0.9)} ${theme.spacing(2)}`,
}));

const Button = React.forwardRef(function Button(props, ref) {
  const { children, variant = 'contained', ...rest } = props;

  return (
    <StyledButton ref={ref} variant={variant} disableElevation {...rest}>
      {children}
    </StyledButton>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
