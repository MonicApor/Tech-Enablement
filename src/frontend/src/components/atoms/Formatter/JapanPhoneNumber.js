import BodyText from 'components/atoms/BodyText';

function PhoneNumber(props) {
  const { number } = props;
  const formatPhone = (number) => {
    let cleaned = number.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) return `${match[1]}-${match[2]}-${match[2]}`;
    else return 'Invalid Phone Number Provided.';
  };

  return <BodyText>{formatPhone(number)}</BodyText>;
}

PhoneNumber.propTypes = {
  number: function (props, propName, componentName) {
    if (props[propName].replace(/\D/g, '').length !== 11) {
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

export default PhoneNumber;
