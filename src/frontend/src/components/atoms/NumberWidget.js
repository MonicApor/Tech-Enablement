import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

function NumberWidget(props) {
  const { label, value } = props;

  return (
    <Item>
      <Typography variant="subtitle1" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="h3" component="h3">
        {value}
      </Typography>
    </Item>
  );
}

NumberWidget.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
};

export default NumberWidget;
