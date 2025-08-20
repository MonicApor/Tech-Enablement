import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isAuthenticated } from 'services/auth';
import { setProfile } from 'store/slices/profileSlice';
import Unauthorized from 'pages/authenticated/Unauthorized';
import Admin from './Admin';
import Employee from './Employee';
import User from './User';

function Authenticated() {
  const location = useLocation();
  const navigate = useNavigate();
  const [layout, setLayout] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.profile.user);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!user) {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          dispatch(setProfile(parsedUser));
          return;
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
          localStorage.removeItem('user');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }

    if (user) {
      const { role } = user;

      if (location.pathname.includes('admin') && role !== 'System Admin') {
        setLayout(<Unauthorized />);
        return;
      }

      switch (role) {
        case 'System Admin':
          setLayout(<Admin />);
          break;
        case 'Employee':
          setLayout(<Employee />);
          break;
        default:
          setLayout(<User />);
          break;
      }
    }
  }, [user, location.pathname, dispatch]);

  return (
    <>
      {layout}

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </>
  );
}

export default Authenticated;
