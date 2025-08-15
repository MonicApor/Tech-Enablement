import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListItem, List as MUIList, Typography } from '@mui/material';
import { blueGrey } from '@mui/material/colors';

function List(props) {
  const {
    items = [],
    inline = false,
    variant = 'body2',
    color = blueGrey['A100'],
    ...rest
  } = props;

  const styles = {
    display: 'flex',
    flexDirection: inline ? 'row' : 'column',
  };

  return (
    <MUIList style={styles} {...rest}>
      {items.map(({ label, url }, key) => {
        return (
          <ListItem dense disableGutters key={key}>
            <Typography
              component={Link}
              to={url}
              variant={variant}
              sx={{ textDecoration: 'none', color }}
            >
              {label}
            </Typography>
          </ListItem>
        );
      })}
    </MUIList>
  );
}

List.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  inline: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
};

export default List;
