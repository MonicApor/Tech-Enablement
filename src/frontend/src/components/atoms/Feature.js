import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function Feature(props) {
  const { title = null, description = null, image = null, left = true } = props;

  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={12}>
        <Grid size={{ xs: 12, sm: 6 }} order={{ sm: left ? 1 : 2, xs: 1 }}>
          <Box component="img" alt={title} src={image} sx={{ width: '100%', m: '0 auto' }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} order={{ sm: left ? 2 : 1, xs: 2 }}>
          <Typography variant="h5" component="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Typography>{description}</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

Feature.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  left: PropTypes.bool,
};

export default Feature;
