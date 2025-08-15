import { useEffect, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function LanguageSelect() {
  const [locale, setLocale] = useState('en');
  const { i18n } = useTranslation();
  const countries = [
    { name: 'US', locale: 'en' },
    { name: 'JP', locale: 'ja' },
  ];

  useEffect(() => {
    // @TODO Update this implementation if preferred locale is from backend
    const lang = localStorage.getItem('locale') || 'en';
    setLocale(lang);
    i18n.changeLanguage(lang);
  }, []);

  const selectLocale = (value) => {
    setLocale(value);
    localStorage.setItem('locale', value);
    i18n.changeLanguage(value);
  };

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 20 }}>
      <Select
        value={locale}
        onChange={(e) => selectLocale(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        defaultValue={locale}
        sx={{ height: 40, boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
      >
        {countries.map((country, key) => {
          return (
            <MenuItem key={key} value={country.locale}>
              <ReactCountryFlag className="emojiFlag" countryCode={country.name} svg />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default LanguageSelect;
