import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function Section(props) {
  const { fullWidth = false, heading = null, children, background = 'none', ...rest } = props;

  return (
    <Box component="section" sx={{ py: 12, backgroundColor: background }}>
      <Container maxWidth={fullWidth ? 'lg' : false} {...rest}>
        <Typography
          component="h4"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          {heading}
        </Typography>

        {children}
      </Container>
    </Box>
  );
}

Section.propTypes = {
  fullWidth: PropTypes.bool,
  heading: PropTypes.string,
  children: PropTypes.node,
  background: PropTypes.string,
};

export default Section;
