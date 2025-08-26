import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import CampaignIcon from '@mui/icons-material/Campaign';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const employeeLinks = [
  {
    label: 'Dashboard',
    path: '/employee',
    icon: <DashboardIcon />,
  },
  {
    label: 'Create Post',
    path: '/employee/create-post',
    icon: <CampaignIcon />,
  },
  {
    label: 'My Posts',
    path: '/employee/my-posts',
    icon: <CampaignIcon />,
  },
  {
    label: 'Notifications',
    path: '/employee/notifications',
    icon: <NotificationsIcon />,
  },
  {
    label: 'My UpVotes',
    path: '/employee/my-upvotes',
    icon: <ThumbUpIcon />,
  },
  {
    label: 'Settings',
    path: '/employee/settings',
    icon: <SettingsIcon />,
  },
];

function SidebarMenu() {
  const location = useLocation();
  const { t } = useTranslation();
  const localizeLinks = [...employeeLinks];

  // add localization to menu items
  localizeLinks.map((link) => {
    const key = link.path === '/employee' ? 'dashboard' : link.path.replace('/employee/', '');
    link.label = t(`menu.${key}`);
    return link;
  });

  return (
    <>
      {localizeLinks.map((item, key) => {
        return (
          <ListItemButton
            key={key}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={<Typography variant="body2">{item.label}</Typography>} />
          </ListItemButton>
        );
      })}
    </>
  );
}

export { SidebarMenu };
