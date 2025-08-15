import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

function MemberCard(props) {
  const { name = null, avatar = null, role = null } = props;

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card>
        <CardMedia component="img" height={140} image={avatar} alt={name} />
        <CardContent>
          <Typography align="center" sx={{ fontWeight: '600' }}>
            {name}
          </Typography>
          <Typography component="p" variant="subtitle2" align="center">
            {role}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

MemberCard.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  role: PropTypes.string,
};

export default MemberCard;
