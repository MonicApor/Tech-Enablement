import PropTypes from 'prop-types';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import Box from '@mui/material/Box';
import ReviewCard from 'components/atoms/ReviewCard';

function ReviewSlider(props) {
  const { reviews = [], ...rest } = props;

  return (
    <Box {...rest}>
      <Swiper
        slidesPerView={3}
        slidesPerGroup={3}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          425: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Navigation]}
        className="review-slider"
      >
        {reviews.map((review, key) => {
          return (
            <SwiperSlide key={key}>
              <ReviewCard review={review} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}

ReviewSlider.propTypes = {
  reviews: PropTypes.array,
};

export default ReviewSlider;
