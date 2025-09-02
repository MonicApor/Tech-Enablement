import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grow from '@mui/material/Grow';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import stringToColor from 'utils/stringToColor';

function AvatarNavDropdown(props) {
  const { user, links } = props;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getAvatarProps = (user) => {
    const props = {
      sx: {
        marginLeft: '16px',
        cursor: 'pointer',
      },
    };

    return user.avatar
      ? {
          ...props,
          ...{
            alt: user.username,
            src: user.avatar,
          },
        }
      : {
          ...props,
          ...{
            sx: {
              bgcolor: stringToColor(user.username || 'Unknown User'),
              marginLeft: '16px',
              cursor: 'pointer',
            },
            children: user.name
              ? (() => {
                  const nameParts = user.username.split(' ');
                  const firstInitial = nameParts[0]?.[0] || '';
                  const lastInitial = nameParts[1]?.[0] || '';
                  return `${firstInitial}${lastInitial}`;
                })()
              : '??',
          },
        };
  };

  const handleOnClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOnClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleOnClickOutside);
      setOpen(false);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <Button ref={buttonRef} sx={{ position: 'relative' }}>
      <Box
        onClick={() => setOpen(!open)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Avatar {...getAvatarProps(user)} />
        {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Box>

      <Grow in={open} style={{ transformOrigin: 'top right' }} {...(open ? { timeout: 200 } : {})}>
        <List
          sx={{
            position: 'absolute',
            width: 250,
            right: 0,
            background: 'white',
            boxShadow: 3,
            borderRadius: 2,
            top: 56,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 100,
          }}
        >
          {links.map((link, key) => (
            <ListItemButton onClick={() => navigate(link.url)} key={key} sx={{ color: '#000' }}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Grow>
    </Button>
  );
}

AvatarNavDropdown.propTypes = {
  user: PropTypes.object.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
};

export default AvatarNavDropdown;
