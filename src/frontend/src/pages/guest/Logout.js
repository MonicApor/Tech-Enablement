import { useEffect } from 'react';
import { logout } from 'services/auth';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function Logout() {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.log(e.message);
      }
      localStorage.clear();
      window.location = '/login?ref=logout';
    };

    handleLogout();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}
