import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setProfile } from 'store/slices/profileSlice';
import Unauthorized from 'pages/authenticated/Unauthorized';
import api from 'utils/api';
import Admin from './Admin';
import User from './User';

function Authenticated() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [layout, setLayout] = useState(null);
  const user = useSelector((state) => state.profile.user);

  const fetchProfile = async () => {
    const user = await api
      .get('/profile')
      .then((res) => res.data.data)
      .catch(() => navigate(`/login?redirect_to=${location.pathname}`));
    dispatch(setProfile(user));
  };

  useEffect(() => {
    if (!user) fetchProfile();
  }, []);

  useEffect(() => {
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
        default:
          setLayout(<User />);
          break;
      }
    }
  }, [user]);

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
