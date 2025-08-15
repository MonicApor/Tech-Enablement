import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import MemberCard from 'components/atoms/MemberCard';

function MemberList(props) {
  const { members = [] } = props;

  return (
    <Grid container spacing={6}>
      {members.map((member, key) => (
        <MemberCard key={key} name={member.name} avatar={member.avatar} role={member.role} />
      ))}
    </Grid>
  );
}

MemberList.propTypes = {
  members: PropTypes.array,
};

export default MemberList;
