import PropTypes from 'prop-types';
import * as React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButtonRound = styled(MuiButton)(({ theme }) => ({
  backgroundColor: 'none',
  color: 'white',
  padding: `${theme.spacing(2)} ${theme.spacing(6)}`,
  border: '3px solid white',
  fontWeight: 700,
  letterSpacing: '2px',
  borderRadius: 64,
}));

const ButtonRound = React.forwardRef(function ButtonRound(props, ref) {
  const { children, ...rest } = props;

  return (
    <StyledButtonRound ref={ref} disableElevation {...rest}>
      {children}
    </StyledButtonRound>
  );
});

ButtonRound.propTypes = {
  children: PropTypes.node,
};

export default ButtonRound;
