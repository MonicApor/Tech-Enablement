import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { MailOutlined } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, Toolbar, Typography } from '@mui/material';
import LanguageSelect from 'components/atoms/LanguageSelect';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import NotificationIcon from 'components/molecules/NotificationIcon';

const Navbar = ({ user }) => {
  const location = useLocation();
  const [title, setTitle] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const link = links.find((link) => link.path === location.pathname);
    if (link) setTitle(link.label);
  }, [location]);

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    { label: t('menu.logout'), url: '/logout' },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
          <Link to="/">
            <img src="/static/images/anon.png" alt="ANON" height={32} />
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 2, color: 'darkblue', fontWeight: 'bold' }}
          >
            {title || 'ANON'}
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', gap: 2 } }}>
          <LanguageSelect />
          <IconButton>
            <Badge color="secondary" badgeContent={4}>
              <MailOutlined />
            </Badge>
          </IconButton>
          <NotificationIcon user={user} darkMode={true} />
          <AvatarNavDropdown user={user} links={links} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  user: PropTypes.object,
};

export default Navbar;
