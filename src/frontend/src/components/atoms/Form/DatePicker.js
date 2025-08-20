import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useController } from 'react-hook-form';
import { DateTimePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// set valid date formats
const validDateFormats = ['YYYY/MM/DD', 'MM/DD/YYYY', 'YYYY-MM-DD', 'MM-DD-YYYY'];

const DatePicker = React.forwardRef(function DatePicker(props, ref) {
  const {
    name = '',
    label = '',
    format = 'YYYY/MM/DD',
    control,
    error = false,
    helperText = '',
    hasTime = false,
    value = '',
    onChange,
  } = props;
  const [locale, setLocale] = React.useState('en');
  const Component = hasTime ? DateTimePicker : DesktopDatePicker;

  React.useEffect(() => {
    const lang = localStorage.getItem('locale') ?? 'en';
    setLocale(lang);
  }, [locale]);

  React.useEffect(() => {
    if (validDateFormats.indexOf(format) < 0) {
      throw new Error('Invalid date format provided.');
    }
  }, [format]);

  const ReactHookFormDatePicker = () => {
    const { field } = useController({ name, control });

    return (
      <Component
        label={label}
        inputFormat={hasTime ? `${format} hh:mm` : format}
        slotProps={{
          textField: {
            error: error,
            helperText: helperText,
          },
        }}
        {...field}
      />
    );
  };

  const NormalDatePicker = () => {
    return (
      <Component
        ref={ref}
        label={label}
        value={value}
        inputFormat={hasTime ? `${format} hh:mm` : format}
        onChange={onChange}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {control ? <ReactHookFormDatePicker /> : <NormalDatePicker />}
    </LocalizationProvider>
  );
});

DatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  format: PropTypes.oneOf(validDateFormats),
  control: PropTypes.any,
  hasTime: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export default DatePicker;
