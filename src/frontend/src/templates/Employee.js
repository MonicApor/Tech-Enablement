import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { logout } from 'services/auth';
import { Box } from '@mui/material';
import { Navbar, Rightbar, Sidebar } from 'components/organisms/Common';

export default function Employee() {
  const user = useSelector((state) => state.profile.user);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
        minHeight: '100vh',
      }}
      component="main"
    >
      {/* Navbar */}
      <Navbar user={user} onLogout={() => handleLogout()} />

      {/* Main Content Layout */}
      <Box
        sx={{
          maxWidth: '100%',
          mx: 'auto',
          py: 6,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '400px 1fr 450px',
            },
            gap: 3,
            width: '100%',
          }}
        >
          {/* Sidebar */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Sidebar />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              width: '100%',
              // maxHeight: 'calc(100vh - 200px)',
              // overflow: 'auto',
              // scrollbarWidth: 'thin',
            }}
          >
            <Outlet />
          </Box>

          {/* Rightbar */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Rightbar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
