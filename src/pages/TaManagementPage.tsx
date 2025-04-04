import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  People as PeopleIcon, 
  AccessTime as AccessTimeIcon, 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
  GppBadOutlined as UnverifiedIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

interface Bucket {
  name: string;
  successRate: number;
  minDeposit: number;
  isLocked: boolean;
}

const availableBuckets: Bucket[] = [
  {
    name: "Basic Bucket",
    successRate: 50,
    minDeposit: 0,
    isLocked: false
  },
  {
    name: "Gold Bucket",
    successRate: 65,
    minDeposit: 10000,
    isLocked: false
  },
  {
    name: "Platinum Bucket",
    successRate: 75,
    minDeposit: 20000,
    isLocked: true
  },
  {
    name: "Diamond Bucket",
    successRate: 85,
    minDeposit: 50000,
    isLocked: true
  }
];

interface TARegistration {
  id: string;
  name: string;
  email: string;
  nsimNumber: string;
  registeredDate: string;
  registeredTime: string;
  status: 'Pending' | 'Approved' | 'Declined' | 'Blocked';
  verification: 'OTP Verified' | 'Not Verified';
  initials: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  documents?: {
    aadhar: string;
    nsim: string;
  };
  allowedBuckets?: string[];
  pendingReconciliationAmount?: number;
}

// Add Study interface
interface Study {
  id: number;
  exchange: string;
  index: string;
  stock: string;
  currentPrice: number;
  action: 'BUY' | 'SELL';
  expectedPrice: number;
  studyText: string;
  submittedDate: string;
}

// Add mock studies data
const mockStudies: Study[] = [
  {
    id: 1,
    exchange: 'NSE',
    index: 'NIFTY 50',
    stock: 'RELIANCE',
    currentPrice: 2456.75,
    action: 'BUY',
    expectedPrice: 2600.00,
    studyText: 'Technical analysis suggests bullish trend...',
    submittedDate: '2024-03-20',
  },
  {
    id: 2,
    exchange: 'BSE',
    index: 'SENSEX',
    stock: 'TCS',
    currentPrice: 3456.80,
    action: 'SELL',
    expectedPrice: 3200.00,
    studyText: 'Fundamental analysis indicates overvaluation...',
    submittedDate: '2024-03-19',
  },
];

const TaManagementPage: React.FC = () => {
  const [selectedTA, setSelectedTA] = useState<TARegistration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Approved' | 'Declined' | 'Blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [openStudyDialog, setOpenStudyDialog] = useState(false);
  const [openStudyDetailsDialog, setOpenStudyDetailsDialog] = useState(false);

  // Update the mock data to include more TAs with different statuses
  const allTARegistrations: TARegistration[] = [
    {
      id: '1',
      name: 'Anil Sharma',
      email: 'anil.sharma@example.com',
      nsimNumber: 'NS-7834-2025',
      registeredDate: 'Mar 21, 2025',
      registeredTime: '10:23 AM',
      status: 'Pending',
      verification: 'Not Verified',
      initials: 'AS',
      phone: '+91 98765 43210',
      address: '123, Street Name, City, State - 123456',
      experience: '5 years in financial advisory',
      education: 'MBA Finance',
      documents: {
        aadhar: 'aadhar_card.pdf',
        nsim: 'nsim.pdf'
      },
      allowedBuckets: ["Basic Bucket", "Gold Bucket"],
      pendingReconciliationAmount: 1000
    },
    {
      id: '2',
      name: 'Ravi Patel',
      email: 'ravi.patel@example.com',
      nsimNumber: 'NS-7836-2025',
      registeredDate: 'Mar 20, 2025',
      registeredTime: '4:12 PM',
      status: 'Approved',
      verification: 'Not Verified',
      initials: 'RP'
    },
    {
      id: '3',
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      nsimNumber: 'NS-7838-2025',
      registeredDate: 'Mar 19, 2025',
      registeredTime: '2:30 PM',
      status: 'Declined',
      verification: 'Not Verified',
      initials: 'PS'
    },
    {
      id: '4',
      name: 'Akash Singh',
      email: 'akash.singh@example.com',
      nsimNumber: 'NS-8998-2025',
      registeredDate: 'Mar 19, 2025',
      registeredTime: '2:30 PM',
      status: 'Blocked',
      verification: 'Not Verified',
      initials: 'PS'
    },
    {
      id: '5',
      name: 'Meera Desai',
      email: 'meera.desai@example.com',
      nsimNumber: 'NS-9001-2025',
      registeredDate: 'Mar 18, 2025',
      registeredTime: '11:15 AM',
      status: 'Approved',
      verification: 'OTP Verified',
      initials: 'MD',
      phone: '+91 98765 43211',
      address: '456, Street Name, City, State - 123456',
      experience: '8 years in financial advisory',
      education: 'MCom Finance',
      documents: {
        aadhar: 'aadhar_card.pdf',
        nsim: 'nsim.pdf'
      },
      allowedBuckets: ["Basic Bucket", "Gold Bucket", "Platinum Bucket"],
      pendingReconciliationAmount: 2500
    }
  ];

  // Function to calculate dashboard stats
  const getDashboardStats = () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));

    return {
      totalTAs: allTARegistrations.length,
      newTAsThisMonth: allTARegistrations.filter(ta => 
        new Date(ta.registeredDate) >= firstDayOfMonth
      ).length,
      pendingReview: allTARegistrations.filter(ta => 
        ta.status === 'Pending'
      ).length,
      updatedAgo: '10 minutes ago',
      approved: allTARegistrations.filter(ta => 
        ta.status === 'Approved'
      ).length,
      newThisWeek: allTARegistrations.filter(ta => 
        new Date(ta.registeredDate) >= firstDayOfWeek
      ).length,
      declined: allTARegistrations.filter(ta => 
        ta.status === 'Declined'
      ).length,
      declinedToday: allTARegistrations.filter(ta => 
        ta.status === 'Declined' && 
        new Date(ta.registeredDate).toDateString() === new Date().toDateString()
      ).length,
      blocked: allTARegistrations.filter(ta => 
        ta.status === 'Blocked'
      ).length,
      blockedToday: allTARegistrations.filter(ta => 
        ta.status === 'Blocked' && 
        new Date(ta.registeredDate).toDateString() === new Date().toDateString()
      ).length
    };
  };

  // Get current stats
  const dashboardStats = getDashboardStats();

  const handleViewTA = (taId: string) => {
    const ta = allTARegistrations.find(reg => reg.id === taId);
    if (ta) {
      setSelectedTA(ta);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTA(null);
  };

  const handleApprove = (taId: string) => {
    console.log('Approving TA:', taId);
    // Add your approve logic here
    handleCloseModal();
  };

  const handleDecline = (taId: string) => {
    console.log('Declining TA:', taId);
    // Add your decline logic here
    handleCloseModal();
  };

  // Add filter handler
  const handleStatusFilterClick = (status: 'all' | 'Pending' | 'Approved' | 'Declined' | 'Blocked') => {
    setStatusFilter(status);
  };

  // Add filtered data getter
  const getFilteredTAs = () => {
    let filtered = allTARegistrations;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ta => ta.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ta => 
        ta.name.toLowerCase().includes(query) ||
        ta.email.toLowerCase().includes(query) ||
        ta.nsimNumber.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  // Add new handler functions
  const handleBlock = (taId: string) => {
    console.log('Blocking TA:', taId);
    // Add your block logic here
    handleCloseModal();
  };

  const handleRequestOTP = (taId: string) => {
    console.log('Requesting OTP verification for TA:', taId);
    // Add your OTP request logic here
  };

  const handleViewStudies = () => {
    setOpenStudyDialog(true);
  };

  const handleCloseStudyDialog = () => {
    setOpenStudyDialog(false);
  };

  const handleViewStudyDetails = (study: Study) => {
    setSelectedStudy(study);
    setOpenStudyDetailsDialog(true);
  };

  const handleCloseStudyDetailsDialog = () => {
    setOpenStudyDetailsDialog(false);
    setSelectedStudy(null);
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            TA Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Welcome back, Admin
          </Typography>

          {/* Notifications */}
          <Alert 
            severity="warning" 
            sx={{ mt: 3, mb: 4 }}
          >
            New TA Registration: There {dashboardStats.pendingReview === 1 ? 'is' : 'are'} {dashboardStats.pendingReview} pending registration{dashboardStats.pendingReview === 1 ? '' : 's'} requiring review.
          </Alert>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {/* Total TAs */}
            <Grid item xs={12} md={6} lg={2.4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'all' ? 'primary.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleStatusFilterClick('all')}
              >
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
            <Grid item xs={12} md={6} lg={2.4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Pending' ? 'warning.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleStatusFilterClick('Pending')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                    <AccessTimeIcon />
                  </Avatar>
                  <Typography variant="h6">Pending</Typography>
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
            <Grid item xs={12} md={6} lg={2.4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Approved' ? 'success.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleStatusFilterClick('Approved')}
              >
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
            <Grid item xs={12} md={6} lg={2.4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Declined' ? 'error.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleStatusFilterClick('Declined')}
              >
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

            {/* Blocked */}
            <Grid item xs={12} md={6} lg={2.4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Blocked' ? 'error.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleStatusFilterClick('Blocked')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                    <CancelIcon />
                  </Avatar>
                  <Typography variant="h6">Blocked</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {dashboardStats.blocked}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardStats.blockedToday} today
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Update the table section to include search */}
          <Box sx={{ mt: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              gap: 2,
              flexWrap: 'wrap'
            }}>
              <Typography variant="h6" component="h2">
                {statusFilter === 'all' ? 'All TA Registrations' : `${statusFilter} TA Registrations`}
              </Typography>
              
              <TextField
                placeholder="Search by name, email, or NSIM number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ 
                  minWidth: 300,
                  maxWidth: '100%',
                  bgcolor: 'background.paper'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="TA registrations table">
                <TableHead>
                  <TableRow>
                    <TableCell>NAME</TableCell>
                    <TableCell>NSIM NUMBER</TableCell>
                    <TableCell>REGISTERED</TableCell>
                    <TableCell>STATUS & ACTIONS</TableCell>
                    <TableCell>AADHAR VERIFICATION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredTAs().map((registration) => (
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
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2
                        }}>
                          <Tooltip title="View TA Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTA(registration.id)}
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                width: '28px',
                                height: '28px',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Chip 
                            label={registration.status} 
                            color={
                              registration.status === 'Pending' ? 'warning' : 
                              registration.status === 'Approved' ? 'success' : 
                              registration.status === 'Blocked' ? 'error' : 'default'
                            } 
                            sx={{
                              ...(registration.status === 'Declined' && {
                                bgcolor: 'grey.200',
                                color: 'grey.700',
                                borderColor: 'grey.400',
                                '&:hover': {
                                  bgcolor: 'grey.300',
                                }
                              }),
                              height: '28px'
                            }}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {registration.verification === 'OTP Verified' ? (
                            <VerifiedIcon color="success" sx={{ mr: 1 }} />
                          ) : (
                            <UnverifiedIcon color="error" sx={{ mr: 1 }} />
                          )}
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

      {/* TA Details Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {selectedTA && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedTA.initials}
                </Avatar>
                <Typography variant="h6">
                  TA Details
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Personal Information
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Full Name
                        </Typography>
                        <Typography variant="body1">{selectedTA.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{selectedTA.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">{selectedTA.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          NSIM Number
                        </Typography>
                        <Typography variant="body1">{selectedTA.nsimNumber}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Professional Information
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Experience
                        </Typography>
                        <Typography variant="body1">{selectedTA.experience}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Education
                        </Typography>
                        <Typography variant="body1">{selectedTA.education}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total amount on which reconciliation has not initiated
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{
                            color: (selectedTA.pendingReconciliationAmount || 0) >= 0 ? '#2e7d32' : '#d32f2f',
                            fontWeight: 500
                          }}
                        >
                          {(selectedTA.pendingReconciliationAmount || 0) >= 0 ? '+' : '-'}₹{Math.abs(selectedTA.pendingReconciliationAmount || 0).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Documents */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Uploaded Documents
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {Object.entries(selectedTA.documents || {}).map(([key, value]) => (
                        <Grid item xs={12} sm={4} key={key}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<VisibilityIcon />}
                            onClick={() => console.log(`View ${key}`)}
                          >
                            View {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Bucket Management */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Bucket Management
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                      {availableBuckets.map((bucket) => {
                        const isAllowed = selectedTA.allowedBuckets?.includes(bucket.name);
                        
                        return (
                          <Grid item xs={12} sm={6} key={bucket.name}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 2, 
                                border: '1px solid',
                                borderColor: isAllowed ? 'success.main' : 'grey.300',
                                bgcolor: isAllowed ? '#e0f7e0' : 'background.paper',
                                borderRadius: 2
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="subtitle1" color="primary">
                                    {bucket.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Success Rate: {bucket.successRate}%
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Min Deposit: ₹{bucket.minDeposit.toLocaleString()}
                                  </Typography>
                                </Box>
                                
                                {isAllowed ? (
                                  <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    onClick={() => {
                                      // Logic to revoke bucket access
                                      console.log(`Revoking access to ${bucket.name}`);
                                      // Update the selectedTA.allowedBuckets to remove the bucket
                                      setSelectedTA(prev => ({
                                        ...prev!,
                                        allowedBuckets: prev?.allowedBuckets?.filter(b => b !== bucket.name)
                                      }));
                                    }}
                                  >
                                    Revoke Access
                                  </Button>
                                ) : (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                      // Add logic to grant bucket access
                                      console.log(`Granting access to ${bucket.name}`);
                                    }}
                                  >
                                    Grant Access
                                  </Button>
                                )}
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Add Studies Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Submitted Studies
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AssessmentIcon />}
                      onClick={handleViewStudies}
                      fullWidth
                    >
                      View All Submitted Studies
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseModal}>
                Cancel
              </Button>

              {/* Buttons for Approved Users */}
              {selectedTA.status === 'Approved' && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleBlock(selectedTA.id)}
                    sx={{ mx: 1 }}
                  >
                    Block
                  </Button>
                  {selectedTA.verification === 'Not Verified' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleRequestOTP(selectedTA.id)}
                      sx={{ mx: 1 }}
                    >
                      Request Aadhar Verification
                    </Button>
                  )}
                </>
              )}

              {/* Buttons for Blocked Users */}
              {selectedTA.status === 'Blocked' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(selectedTA.id)}
                  sx={{ mx: 1 }}
                >
                  Approve
                </Button>
              )}

              {/* Buttons for Pending Users */}
              {selectedTA.status === 'Pending' && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleDecline(selectedTA.id)}
                    sx={{ 
                      mx: 1,
                      bgcolor: 'grey.200',
                      color: 'grey.700',
                      borderColor: 'grey.400',
                      '&:hover': {
                        bgcolor: 'grey.300',
                        borderColor: 'grey.500',
                      }
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleBlock(selectedTA.id)}
                    sx={{ mx: 1 }}
                  >
                    Block
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(selectedTA.id)}
                  >
                    Approve
                  </Button>
                </>
              )}

              {/* Buttons for Declined Users */}
              {selectedTA.status === 'Declined' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(selectedTA.id)}
                  sx={{ mx: 1 }}
                >
                  Approve
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Studies Dialog */}
      <Dialog
        open={openStudyDialog}
        onClose={handleCloseStudyDialog}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle>Submitted Studies</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell>Index</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Current Price</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Expected Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockStudies.map((study) => (
                  <TableRow key={study.id}>
                    <TableCell>{study.submittedDate}</TableCell>
                    <TableCell>{study.exchange}</TableCell>
                    <TableCell>{study.index}</TableCell>
                    <TableCell>{study.stock}</TableCell>
                    <TableCell>₹{study.currentPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography
                        color={study.action === 'BUY' ? 'success.main' : 'error.main'}
                        fontWeight="bold"
                      >
                        {study.action}
                      </Typography>
                    </TableCell>
                    <TableCell>₹{study.expectedPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewStudyDetails(study)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudyDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Study Details Dialog */}
      <Dialog
        open={openStudyDetailsDialog}
        onClose={handleCloseStudyDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Study Details</DialogTitle>
        <DialogContent>
          {selectedStudy && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Exchange
                </Typography>
                <Typography variant="body1">{selectedStudy.exchange}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Index
                </Typography>
                <Typography variant="body1">{selectedStudy.index}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Stock
                </Typography>
                <Typography variant="body1">{selectedStudy.stock}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Price
                </Typography>
                <Typography variant="body1">₹{selectedStudy.currentPrice.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Action
                </Typography>
                <Typography
                  variant="body1"
                  color={selectedStudy.action === 'BUY' ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {selectedStudy.action}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expected Price
                </Typography>
                <Typography variant="body1">₹{selectedStudy.expectedPrice.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Study Analysis
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedStudy.studyText}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStudyDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default TaManagementPage;