import React from 'react';
import { Select, MenuItem, FormControl, ListItemIcon, Typography, SelectChangeEvent } from '@mui/material';
import ruFlag from '../assets/ru.svg';
import deFlag from '../assets/de.svg';
import uaFlag from '../assets/ua.svg';
import { useTranslation } from 'react-i18next';

type LanguageOption = {
  code: string;
  short: string;
  name: string;
  image: string;
};

const languages: LanguageOption[] = [
  { code: 'ru', short: 'RU', name: 'Русский', image: ruFlag },
  { code: 'de', short: 'DE',name: 'Deutsch', image: deFlag },
  { code: 'ua', short: 'UA',name: 'Українська', image: uaFlag },
];

const LanguageDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState<string>(i18n.language || 'de');

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value as string;
    setLanguage(newLanguage); 
    i18n.changeLanguage(newLanguage);
    
  };

  return (
    <FormControl sx={{ width: '6.34rem', display: 'flex' }}>
      <Select
        sx={{ height: '45px' }}
        id="language-select"
        value={language}
        onChange={handleChange}
      >
        {languages.map((lang) => (
          <MenuItem sx={{ height: '40px', borderColor: 'rgb(76, 121, 212)' }} key={lang.code} value={lang.code}>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
              <ListItemIcon style={{ minWidth: 'unset', marginRight: '8px' }}>
                <img src={lang.image} alt={lang.code} style={{ width: 24, height: 16 }} />
              </ListItemIcon>
              <Typography variant="inherit" noWrap>{lang.short}</Typography>
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageDropdown;