import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  History as HistoryIcon,
  CompareArrows as ReconciliationIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

interface TALayoutProps {
  children: React.ReactNode;
}

const TALayout: React.FC<TALayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { text: 'MAIN', type: 'header' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/tadashboard' },
    { text: 'Call History', icon: <HistoryIcon />, path: '/callhistory' },
    { text: 'Reconciliation', icon: <ReconciliationIcon />, path: '/reconciliation' },
    { text: 'ACCOUNT', type: 'header' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/taprofile' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#1a2035',
            color: 'white',
          },
        }}
      >
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#3f51b5' }}>H</Avatar>
            <Box>
              <Typography variant="subtitle2">Home</Typography>
            </Box>
          </Typography>
        </Box>

        <List>
          {sidebarItems.map((item) => (
            item.type === 'header' ? (
              <Typography
                key={item.text}
                variant="caption"
                sx={{ px: 3, py: 1.5, opacity: 0.7, display: 'block' }}
              >
                {item.text}
              </Typography>
            ) : (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => item.path && navigate(item.path)}
                  sx={{
                    px: 3,
                    py: 1,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default TALayout;