import PropTypes from 'prop-types';
import BodyText from 'components/atoms/BodyText';

function JapanDate(props) {
  const { date, hasTime = false, separator = 'kanji' } = props;

  const formatDate = (date) => {
    if (isNaN(date) && isNaN(Date.parse(date))) {
      return 'Invalid date provided.';
    }

    if (['kanji', '-', '/'].includes(separator) !== true) {
      return 'Invalid date separator provided.';
    }

    const d = new Date(date);
    const year = d.toLocaleString('jp', { year: 'numeric' });
    const month = d.toLocaleString('jp', { month: '2-digit' });
    const day = d.toLocaleString('jp', { day: '2-digit' });
    const hour = d.toLocaleTimeString('jp', { hour: '2-digit', hour12: false });
    let minute = d.toLocaleTimeString('jp', { minute: '2-digit', hour12: false });
    minute = minute < 10 ? `0${minute}` : minute;
    let second = d.toLocaleTimeString('jp', { second: '2-digit', hour12: false });
    second = second < 10 ? `0${second}` : second;
    const formatted =
      separator === 'kanji' ? `${year}年${month}月${day}日` : [year, month, day].join(separator);
    const timeStamp =
      separator === 'kanji' ? `${hour}時${minute}分${second}秒` : `${hour}:${minute}:${second}`;

    return hasTime ? `${formatted} ${timeStamp}` : formatted;
  };

  return <BodyText>{formatDate(date)}</BodyText>;
}

JapanDate.propTypes = {
  hasTime: PropTypes.bool,
  date: function (props, propName, componentName) {
    if (isNaN(props[propName]) && isNaN(Date.parse(props[propName]))) {
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
  separator: PropTypes.oneOf(['kanji', '/', '-']),
};

export default JapanDate;
