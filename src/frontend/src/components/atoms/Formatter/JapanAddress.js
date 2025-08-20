import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import BodyText from 'components/atoms/BodyText';

function Address(props) {
  const { buildingName, city, prefecture, postalCode } = props;

  const formatPostal = (postalCode) => {
    //Filter only numbers from the input
    const cleaned = postalCode.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{4})$/);
    if (match) return `〒${match[1]}-${match[2]}`;
    else return 'Invalid Postal Code Provided.';
  };

  return (
    <Box>
      <BodyText sx={{ mb: 0 }}>{formatPostal(postalCode)}</BodyText>
      <BodyText>
        {prefecture}
        {city}
        {buildingName}
      </BodyText>
    </Box>
  );
}

Address.propTypes = {
  buildingName: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  prefecture: PropTypes.string.isRequired,
  postalCode: function (props, propName, componentName) {
    if (props[propName].replace(/\D/g, '').length !== 7) {
      return new Error(
        'Invalid prop `' +
          propName +
          '` supplied to' +
          ' `' +
          componentName +
          '`. Validation failed.'
      );
    }
  },
};

export default Address;
