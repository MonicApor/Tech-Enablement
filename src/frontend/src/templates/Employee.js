import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { logout } from 'services/auth';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Navbar, Rightbar, Sidebar } from 'components/organisms/Common';

export default function Employee() {
  const user = useSelector((state) => state.profile.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileRightbarOpen, setMobileRightbarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  const handleSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleRightbarToggle = () => {
    setMobileRightbarOpen(!mobileRightbarOpen);
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
      component="main"
    >
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important' }}>
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/static/images/anon.png" alt="ANON" height={32} />
              <Typography
                variant="h6"
                component="div"
                sx={{ ml: 2, color: 'white', fontWeight: 'bold' }}
              >
                AEFS-APOR
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              aria-label="open rightbar"
              edge="end"
              onClick={handleRightbarToggle}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Navbar */}
      {!isMobile && <Navbar user={user} onLogout={() => handleLogout()} />}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileSidebarOpen}
          onClose={handleSidebarToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              top: 64, // Account for mobile app bar
            },
          }}
        >
          <Box
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={handleSidebarToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Sidebar />
        </Drawer>
      )}

      {/* Mobile Rightbar Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileRightbarOpen}
          onClose={handleRightbarToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
              top: 64,
            },
          }}
        >
          <Box
            sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Quick Actions</Typography>
            <IconButton onClick={handleRightbarToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Rightbar />
        </Drawer>
      )}

      {/* Main Content Layout */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{
          flex: 1,
          pt: isMobile ? 8 : 0,
          height: isMobile ? 'calc(100vh - 64px)' : '100vh',
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: isTablet ? 200 : 240,
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Main Content */}
        <Container
          sx={{
            mt: isMobile ? 1 : 4,
            mb: 4,
            px: isMobile ? 1 : 3,
            flexGrow: 1,
            maxWidth: '100%',
          }}
          maxWidth="xl"
        >
          <Outlet />
        </Container>

        {/* Desktop Rightbar */}
        {!isMobile && (
          <Box
            sx={{
              width: isTablet ? 200 : 520,
              flexShrink: 0,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Rightbar />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
