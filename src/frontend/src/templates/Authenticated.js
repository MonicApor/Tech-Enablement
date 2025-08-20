import { useMicrosoftAuth } from 'hooks/useMicrosoftAuth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Unauthorized from 'pages/authenticated/Unauthorized';
import Admin from './Admin';
import User from './User';

function Authenticated() {
  const location = useLocation();
  const [layout, setLayout] = useState(null);
  const user = useSelector((state) => state.profile.user);

  // Use Microsoft authentication
  const { loading } = useMicrosoftAuth({
    middleware: 'auth',
    redirectIfAuthenticated: null,
  });

  useEffect(() => {
    if (loading) {
      setLayout(null); // Show loading state
      return;
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
        default:
          setLayout(<User />);
          break;
      }
    }
  }, [user, loading, location.pathname]);

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
