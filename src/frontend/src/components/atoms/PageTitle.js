import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Styled = styled(Typography)(({ align, theme }) => ({
  textAlign: align,
  fontSize: theme.typography.h3.fontSize,
  textTransform: 'uppercase',
  position: 'relative',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  '&:before': {
    position: 'absolute',
    bottom: `-${theme.spacing(2)}`,
    width: '60px',
    height: '4px',
    content: '""',
    left: '50%',
    marginLeft: '-30px',
    backgroundColor: theme.palette.primary.main,
  },
}));

const PageTitle = (props) => {
  const { title = null, subTitle = null, align = 'center' } = props;

  return (
    <>
      <Styled component="h1" align={align} gutterBottom>
        {title}
      </Styled>
      {subTitle && (
        <Typography sx={{ mb: 4 }} align="center">
          {subTitle}
        </Typography>
      )}
    </>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default PageTitle;
