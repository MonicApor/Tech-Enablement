import PropTypes from 'prop-types';
import BodyText from 'components/atoms/BodyText';

function Yen(props) {
  const { amount = 0, isKanji = false } = props;
  return (
    <BodyText>
      {!isKanji && '¥'}
      {Number(amount).toLocaleString('ja-JP', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
      {isKanji && '円'}
    </BodyText>
  );
}

Yen.propTypes = {
  amount: PropTypes.number.isRequired,
  isKanji: PropTypes.bool,
};

export default Yen;
