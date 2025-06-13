import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  History as HistoryIcon,
  CompareArrows as ReconciliationIcon,
  Group as TAManagementIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

interface TALayoutProps {
  children: React.ReactNode;
}

const TALayout: React.FC<TALayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userData, logout } = useAuth(); // Get logout function from AuthContext
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    // Call the logout function from AuthContext
    logout();
    setOpenLogoutDialog(false);
    navigate('/');
  };

  // Determine if user is admin to show admin-specific menu items
  const isAdmin = userData?.role === 'ADMIN';

  // Create sidebar items based on user role
  const sidebarItems = [
    { text: 'MAIN', type: 'header' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/tadashboard' },
    { text: 'Call History', icon: <HistoryIcon />, path: '/callhistory' },
    { text: 'Reconciliation', icon: <ReconciliationIcon />, path: '/reconciliation' },
    // Show TA Management only for admin users
    ...(isAdmin ? [{ text: 'TA Management', icon: <TAManagementIcon />, path: '/tamanagement' }] : []),
    { text: 'ACCOUNT', type: 'header' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/taprofile' },
    { text: 'Logout', icon: <LogoutIcon />, path: '#' },
  ];

  const handleNavigation = (path: string) => {
    if (path === '#') {
      setOpenLogoutDialog(true);
    } else {
      navigate(path);
    }
  };

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
                  onClick={() => item.path && handleNavigation(item.path)}
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="contained" color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TALayout;
