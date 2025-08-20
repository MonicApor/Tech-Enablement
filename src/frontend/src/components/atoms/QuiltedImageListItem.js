import PropTypes from 'prop-types';
import { ImageListItem } from '@mui/material';

function QuiltedImageListItem(props) {
  const { title = null, image = null, cols = 1, rows = 1, rowHeight = 121 } = props;

  const srcset = (image, size) => {
    return {
      src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
  };

  return (
    <ImageListItem cols={cols} rows={rows}>
      <img {...srcset(image, rowHeight)} alt={title} loading="lazy" />
    </ImageListItem>
  );
}

QuiltedImageListItem.propTypes = {
  title: PropTypes.string,
  image: PropTypes.string,
  cols: PropTypes.number,
  rows: PropTypes.number,
  rowHeight: PropTypes.number,
};

export default QuiltedImageListItem;
