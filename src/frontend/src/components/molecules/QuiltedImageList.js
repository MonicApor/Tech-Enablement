import PropTypes from 'prop-types';
import { ImageList } from '@mui/material';
import QuiltedImageListItem from 'components/atoms/QuiltedImageListItem';

function QuiltedImageList(props) {
  const { images = [], rowHeight = 121, maxCols = 4 } = props;

  return (
    <ImageList variant="quilted" cols={maxCols} rowHeight={rowHeight}>
      {images.map((item, key) => (
        <QuiltedImageListItem
          key={key}
          title={item.title}
          image={item.image}
          rowHeight={rowHeight}
          cols={item.cols}
          rows={item.rows}
        />
      ))}
    </ImageList>
  );
}

QuiltedImageList.propTypes = {
  images: PropTypes.array,
  rowHeight: PropTypes.number,
  maxCols: PropTypes.number,
};

export default QuiltedImageList;
