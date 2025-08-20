import { Box, Typography } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="body2" component="span">
        &copy; {currentYear} {process.env.REACT_APP_SITE_TITLE}.
      </Typography>
    </Box>
  );
}

export default Footer;
