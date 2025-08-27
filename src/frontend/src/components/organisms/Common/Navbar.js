import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Notifications, Search } from '@mui/icons-material';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  alpha,
} from '@mui/material';
import LanguageSelect from 'components/atoms/LanguageSelect';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';

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
        {/* Left Side - Logo */}
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

        {/* Center - Search Bar */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, flex: 1, justifyContent: 'center', mx: 4 }}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha('#000', 0.04),
              '&:hover': {
                backgroundColor: alpha('#000', 0.08),
              },
              maxWidth: 600,
              width: '100%',
            }}
          >
            <Box
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search feedback..."
                sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Right Side - Language, Notifications, Avatar */}
        <Box sx={{ display: { xs: 'none', md: 'flex', alignItems: 'center', gap: 2 } }}>
          <LanguageSelect />

          <IconButton>
            <Badge color="secondary" badgeContent={4}>
              <Notifications sx={{ color: 'text.primary' }} />
            </Badge>
          </IconButton>

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
