import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Heading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

export default Heading;
