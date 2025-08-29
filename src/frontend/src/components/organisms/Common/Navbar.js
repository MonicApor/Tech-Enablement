import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import LanguageSelect from 'components/atoms/LanguageSelect';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import NotificationIcon from 'components/molecules/NotificationIcon';
import useWebSocket from '../../../hooks/useWebSocket';

const Navbar = ({ user }) => {
  const location = useLocation();
  const [title, setTitle] = useState(null);
  const { t } = useTranslation();
  useWebSocket();
  useEffect(() => {
    const link = links.find((link) => link.path === location.pathname);
    if (link) setTitle(link.label);
  }, [location]);

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    { label: t('menu.logout'), url: '/logout' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
          <Link to="/">
            <img src="/static/images/anon.png" alt="ANON" height={32} className="cursor-pointer" />
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 2, color: 'primary.main', fontWeight: 'bold' }}
          >
            {title || 'ANON'}
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', gap: 2 } }}>
          <LanguageSelect />

          <NotificationIcon user={user} />

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
