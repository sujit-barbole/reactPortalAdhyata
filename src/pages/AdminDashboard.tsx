import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material';
import { 
  People as PeopleIcon, 
  AccessTime as AccessTimeIcon, 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Dashboard as DashboardIcon,
  Description as ReportsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Group as TAManagementIcon,
  Business as InvestorManagementIcon
} from '@mui/icons-material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useNavigate } from 'react-router-dom';

interface TARegistration {
  id: string;
  name: string;
  email: string;
  nsimNumber: string;
  registeredDate: string;
  registeredTime: string;
  status: 'Pending' | 'Approved' | 'Declined';
  verification: 'OTP Verified' | 'Not Verified';
  initials: string;
}

interface SidebarItem {
  text: string;
  type?: 'header';
  icon?: React.ReactNode;
  path?: string;
}

const DRAWER_WIDTH = 240;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - in a real app this would come from API
  const pendingRegistrations: TARegistration[] = [
    {
      id: '1',
      name: 'Anil Sharma',
      email: 'anil.sharma@example.com',
      nsimNumber: 'NS-7834-2025',
      registeredDate: 'Mar 21, 2025',
      registeredTime: '10:23 AM',
      status: 'Pending',
      verification: 'OTP Verified',
      initials: 'AS'
    },
    {
      id: '2',
      name: 'Ravi Patel',
      email: 'ravi.patel@example.com',
      nsimNumber: 'NS-7836-2025',
      registeredDate: 'Mar 20, 2025',
      registeredTime: '4:12 PM',
      status: 'Pending',
      verification: 'OTP Verified',
      initials: 'RP'
    }
  ];

  const dashboardStats = {
    totalTAs: 124,
    newTAsThisMonth: 12,
    pendingReview: 3,
    updatedAgo: '10 minutes ago',
    approved: 118,
    newThisWeek: 5,
    declined: 6,
    declinedToday: 1
  };

  const sidebarItems: SidebarItem[] = [
    { text: 'MAIN', type: 'header' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'TA Management', icon: <TAManagementIcon />, path: '/ta-management' },
    { text: 'Investor Management', icon: <InvestorManagementIcon />, path: '/investor-management' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'ACCOUNT', type: 'header' },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/logout' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
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
        {/* Logo/Brand */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#3f51b5' }}>TS</Avatar>
            <Box>
              <Typography variant="subtitle2">Admin Portal</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Trusted System</Typography>
            </Box>
          </Typography>
        </Box>

        {/* Navigation Items */}
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Welcome back, Admin
            </Typography>

            {/* Notifications */}
            <Alert 
              severity="warning" 
              sx={{ mt: 3, mb: 4 }}
            >
              New TA Registration: There are {dashboardStats.pendingReview} pending registrations requiring review.
            </Alert>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Total TAs */}
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6">Total TAs</Typography>
                  </Box>
                  <Typography variant="h3" component="div" gutterBottom>
                    {dashboardStats.totalTAs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardStats.newTAsThisMonth} new this month
                  </Typography>
                </Paper>
              </Grid>

              {/* Pending Review */}
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                      <AccessTimeIcon />
                    </Avatar>
                    <Typography variant="h6">Pending Review</Typography>
                  </Box>
                  <Typography variant="h3" component="div" gutterBottom>
                    {dashboardStats.pendingReview}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated {dashboardStats.updatedAgo}
                  </Typography>
                </Paper>
              </Grid>

              {/* Approved */}
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                      <CheckCircleIcon />
                    </Avatar>
                    <Typography variant="h6">Approved</Typography>
                  </Box>
                  <Typography variant="h3" component="div" gutterBottom>
                    {dashboardStats.approved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardStats.newThisWeek} new this week
                  </Typography>
                </Paper>
              </Grid>

              {/* Declined */}
              <Grid item xs={12} md={6} lg={3}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                      <CancelIcon />
                    </Avatar>
                    <Typography variant="h6">Declined</Typography>
                  </Box>
                  <Typography variant="h3" component="div" gutterBottom>
                    {dashboardStats.declined}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardStats.declinedToday} today
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Pending Registrations Table */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Pending TA Registrations
                </Typography>
                <Button variant="contained" color="primary">
                  Review All
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="TA registrations table">
                  <TableHead>
                    <TableRow>
                      <TableCell>NAME</TableCell>
                      <TableCell>NSIM NUMBER</TableCell>
                      <TableCell>REGISTERED</TableCell>
                      <TableCell>STATUS</TableCell>
                      <TableCell>VERIFICATION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                              {registration.initials}
                            </Avatar>
                            <Stack>
                              <Typography variant="body1">{registration.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {registration.email}
                              </Typography>
                            </Stack>
                          </Box>
                        </TableCell>
                        <TableCell>{registration.nsimNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{registration.registeredDate}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {registration.registeredTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={registration.status} 
                            color={registration.status === 'Pending' ? 'warning' : 
                                   registration.status === 'Approved' ? 'success' : 'error'} 
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VerifiedIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2">{registration.verification}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;