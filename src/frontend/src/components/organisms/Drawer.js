import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Drawer as MuiDrawer, Typography } from '@mui/material';

const Drawer = forwardRef(function Drawer(props, ref) {
  const { title = '', children, open = false, onClose, anchor = 'right', ...rest } = props;

  const paperProps = {
    sx: () => ({
      width: '100%',
      maxWidth: '720px',
    }),
  };

  return (
    <MuiDrawer
      open={open}
      onClose={onClose}
      PaperProps={paperProps}
      ref={ref}
      anchor={anchor}
      {...rest}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'rgba(224, 224, 224, 1)',
        }}
      >
        <IconButton onClick={onClose} sx={{ p: 0, mr: 2 }} disableRipple={true}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">{title}</Typography>
        <Box></Box>
      </Box>
      <Box sx={{ p: 3, overflowY: 'auto' }}>{children}</Box>
    </MuiDrawer>
  );
});

Drawer.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  anchor: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
};

export default Drawer;
