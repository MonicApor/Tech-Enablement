import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from 'services/auth';
import { setProfile } from 'store/slices/profileSlice';
import { Box } from '@mui/material';
import Footer from 'components/organisms/User/Footer';
import Navbar from 'components/organisms/User/Navbar';
import api from 'utils/api';

export default function User() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.profile.user);

  const handleLogout = async () => {
    await logout();
    localStorage.clear();
    window.location = '/login?ref=logout';
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;

      if (userData) {
        dispatch(setProfile(userData));
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (!location.pathname.includes('login')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate(`/login?redirect_to=${location.pathname}`);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (userData && !user) {
      try {
        const parsedUser = JSON.parse(userData);
        dispatch(setProfile(parsedUser));
        return;
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }

    if (accessToken && !user && !userData) {
      fetchProfile();
    }
  }, [user, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar onLogout={() => handleLogout()} user={user} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          minHeight: 'calc(100vh - 313px)',
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
