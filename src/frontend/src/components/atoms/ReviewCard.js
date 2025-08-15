import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

function ReviewCard(props) {
  const {
    review = {
      avatar: null,
      name: null,
      comment: null,
      rating: 0,
    },
  } = props;
  const { avatar, name, comment, rating } = review;

  return (
    <Card sx={{ py: 3, minHeight: 220 }}>
      <CardContent sx={{ height: '100%' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Avatar alt={name} src={avatar} sx={{ margin: '0 auto', mb: 1 }} />
          <Typography sx={{ fontWeight: 'bold' }} color="text.secondary">
            {name}
          </Typography>

          <Rating value={rating} readOnly sx={{ mb: 2 }} />
        </Box>

        <Typography
          sx={{ fontSize: 14 }}
          color="text.secondary"
          variant="body2"
          component="div"
          align="center"
        >
          {comment}
        </Typography>
      </CardContent>
    </Card>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    comment: PropTypes.string,
    rating: PropTypes.number,
  }),
};

export default ReviewCard;
