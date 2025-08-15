import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from 'services/auth';
import { setProfile } from 'store/slices/profileSlice';
import { Box } from '@mui/material';
import Footer from 'components/organisms/User/Footer';
import Navbar from 'components/organisms/User/Navbar';
import api from 'utils/api';

export default function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.profile.user);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  const fetchProfile = async () => {
    const user = await api
      .get('/profile')
      .then((res) => res.data.data)
      .catch(() => {
        if (location.pathname.includes('login')) {
          return; // prevent too many redirects
        }
        navigate(`/login?redirect_to=${location.pathname}`);
      });
    dispatch(setProfile(user));
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) fetchProfile();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar open={open} onLogout={() => handleLogout()} user={user} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          pb: 8,
          minHeight: 'calc(100vh - 313px)',
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
