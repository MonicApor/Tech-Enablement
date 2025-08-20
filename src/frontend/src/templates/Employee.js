import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { logout } from 'services/auth';
import { Box, Container, Stack } from '@mui/material';
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
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}
      component="main"
    >
      <Navbar user={user} onLogout={() => handleLogout()} />
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ flex: 1 }}>
        <Sidebar />
        <Container sx={{ mt: 4, mb: 4 }} maxWidth="xl">
          <Outlet />
        </Container>
        <Rightbar />
      </Stack>
    </Box>
  );
}
