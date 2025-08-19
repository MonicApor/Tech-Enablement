import { useMicrosoftAuth } from 'hooks/useMicrosoftAuth';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from 'components/atoms/Button';
import LanguageSelect from 'components/atoms/LanguageSelect';
import MenuLinks from 'components/atoms/MenuLinks';
import AvatarNavDropdown from 'components/molecules/AvatarNavDropdown';
import NotificationIcon from 'components/molecules/NotificationIcon';

function Navbar(props) {
  const { user = null } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorMobileNav, setAnchorMobileNav] = useState(null);

  // Use Microsoft authentication
  const { login: microsoftLogin, logout: microsoftLogout } = useMicrosoftAuth();

  const menus = [
    { label: t('menu.about'), url: '/about' },
    { label: t('menu.inquiry'), url: '/inquiry' },
    { label: t('menu.faq'), url: '/faq' },
    { label: t('menu.styleguide'), url: '/styleguide' },
  ];

  const appName = process.env.REACT_APP_SITE_TITLE;

  const handleOpenNavMenu = (event) => setAnchorMobileNav(event.currentTarget);
  const handleCloseNavMenu = (url) => {
    setAnchorMobileNav(null);
    if (!url) return;
    navigate(url, { replace: true });
  };

  const handleLogin = async () => {
    try {
      microsoftLogin();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await microsoftLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const links = [
    { label: t('menu.profile'), url: '/profile' },
    {
      label: t('menu.logout'),
      action: handleLogout, // Use action instead of URL for logout
      url: null,
    },
  ];

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ flexWrap: 'wrap' }} disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', alignItems: 'center' } }}>
            <Link to="/">
              <img src="/static/images/anon.png" alt={appName} height={48} />
            </Link>
            <Typography
              variant="h6"
              component="div"
              sx={{ ml: 2, color: 'darkblue', fontWeight: 'bold' }}
            >
              ANON
            </Typography>
          </Box>

          <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <MenuLinks items={menus} />
          </Box>

          {/** Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="main menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Box
              onClick={() => navigate('/')}
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              <img src="/static/images/anon.png" alt={appName} height={48} />
            </Box>

            <Menu
              id="menu-appbar"
              anchorEl={anchorMobileNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorMobileNav)}
              onClose={() => handleCloseNavMenu(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              MenuListProps={{
                style: {
                  width: 200,
                },
              }}
            >
              {menus.map((menu, key) => (
                <MenuItem key={key} onClick={() => handleCloseNavMenu(menu.url)}>
                  <Typography textAlign="center">{menu.label}</Typography>
                </MenuItem>
              ))}

              {!user && (
                <Box>
                  <MenuItem onClick={() => handleCloseNavMenu('/signup')}>
                    <Typography textAlign="center">{t('labels.signup')}</Typography>
                  </MenuItem>

                  <MenuItem onClick={() => handleCloseNavMenu('/login')}>
                    <Typography textAlign="center">{t('labels.login')}</Typography>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>

          <LanguageSelect sx={{ ml: 1 }} />

          {user ? (
            <Fragment>
              <NotificationIcon user={user} />
              <AvatarNavDropdown user={user} links={links} />
            </Fragment>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {/* <Button component={Link} to="/signup" variant="outlined">
                {t('labels.signup')}
              </Button> */}

              <Button onClick={handleLogin}>Sign in with Microsoft 365</Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Navbar.propTypes = {
  onLogout: PropTypes.func,
  user: PropTypes.object,
};

export default Navbar;
