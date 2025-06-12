import React, { useState, useEffect } from 'react';
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
  TextField,
  InputAdornment,
  CircularProgress,
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
import { adminService, TAUser, StudyResponse } from '../services/api/adminService';
import { useAuth } from '../context/AuthContext';

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
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INITIATED' | 'WAITING_FOR_OTP_FROM_TA' |
  'PENDING_VERIFICATION_FROM_ADMIN' | 'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' |
  'PENDING_TA_AGREEMENT' | 'TA_AGREEMENT_INITIATED' | 'TA_AGREEMENT_SIGNED' |
  'ADMIN_AGREEMENT_SIGNATURE_INITIATED' | 'ADMIN_AGREEMENT_SIGNATURE_SIGNED' |
  'TA_AGREEMENT_REJECTED' | 'LOCKED';
  verification: 'OTP Verified' | 'Not Verified';
  initials: string;
  phone?: string;
  address?: string;
  experience?: string;
  education?: string;
  documents?: {
    aadhar: string;
    nsimDocumentKey: string;
  };
  allowedBuckets?: string[];
  pendingReconciliationAmount?: number;
}

// Add Study interface
interface Study {
  id: number;
  userId: number;
  stockExchange: string;
  stockName: string;
  stockIndex: string;
  currentPrice: number;
  expectedPrice: number;
  action: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

// Add mock studies data
const mockStudies: Study[] = [
  {
    id: 1,
    userId: 1,
    stockExchange: 'NSE',
    stockIndex: 'NIFTY 50',
    stockName: 'RELIANCE',
    currentPrice: 2456.75,
    expectedPrice: 2600.00,
    action: 'BUY',
    analysis: 'Technical analysis suggests bullish trend...',
    createdAt: '2024-03-20T10:23:45',
    updatedAt: '2024-03-20T10:23:45'
  },
  {
    id: 2,
    userId: 1,
    stockExchange: 'BSE',
    stockIndex: 'SENSEX',
    stockName: 'TCS',
    currentPrice: 3456.80,
    expectedPrice: 3200.00,
    action: 'SELL',
    analysis: 'Fundamental analysis indicates overvaluation...',
    createdAt: '2024-03-19T14:12:30',
    updatedAt: '2024-03-19T14:12:30'
  }
];

const TaManagementPage: React.FC = () => {
  const { userData } = useAuth(); // Get userData from AuthContext
  const [selectedTA, setSelectedTA] = useState<TARegistration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INITIATED' |
    'WAITING_FOR_OTP_FROM_TA' | 'PENDING_VERIFICATION_FROM_ADMIN' |
    'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' | 'PENDING_TA_AGREEMENT' |
    'TA_AGREEMENT_INITIATED' | 'TA_AGREEMENT_SIGNED' |
    'ADMIN_AGREEMENT_SIGNATURE_INITIATED' | 'ADMIN_AGREEMENT_SIGNATURE_SIGNED' |
    'TA_AGREEMENT_REJECTED' | 'LOCKED'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [openStudyDialog, setOpenStudyDialog] = useState(false);
  const [openStudyDetailsDialog, setOpenStudyDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allTARegistrations, setAllTARegistrations] = useState<TAUser[]>([]);
  const [openNsimLinkDialog, setOpenNsimLinkDialog] = useState(false);
  const [nsimUsers, setNsimUsers] = useState<TAUser[]>([]);
  const [selectedNsimUser, setSelectedNsimUser] = useState<TAUser | null>(null);
  const [loadingNsimUsers, setLoadingNsimUsers] = useState(false);
  const [studies, setStudies] = useState<Study[]>([]);
  const [loadingStudies, setLoadingStudies] = useState(false);
  const [studiesError, setStudiesError] = useState<string | null>(null);

  // Define fetchTAs function outside of useEffect so it can be reused
  const fetchTAs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsersByRoleAndStatus('TRUSTED_ASSOCIATE');
      if (response.status === 'SUCCESS' && response.data) {
        setAllTARegistrations(response.data);
      } else {
        setError(response.error || 'Failed to fetch TA data');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred while fetching TA data');
    } finally {
      setLoading(false);
    }
  };

  // Example of filtering by role and status
  const fetchTAsByStatus = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUsersByRoleAndStatus('TRUSTED_ASSOCIATE', status);
      if (response.status === 'SUCCESS' && response.data) {
        setAllTARegistrations(response.data);
      } else {
        setError(response.error || 'Failed to fetch TA data');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred while fetching TA data');
    } finally {
      setLoading(false);
    }
  };

  // Add the getFilteredTAs function to filter TAs based on search and status
  const getFilteredTAs = (): TARegistration[] => {
    let filtered = allTARegistrations.map(ta => ({
      id: ta.id,
      name: ta.name,
      email: ta.email,
      nsimNumber: ta.nsimNumber,
      registeredDate: ta.registeredDate,
      registeredTime: ta.registeredTime,
      status: ta.status,
      verification: ta.verification,
      initials: ta.initials,
      phone: ta.phoneNumber,
      address: '',
      experience: '',
      education: '',
      documents: {
        aadhar: ta.aadhaarNumber,
        nsimDocumentKey: ta.nsimDocumentKey
      },
      allowedBuckets: []
    }));

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ta => ta.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ta =>
        ta.name.toLowerCase().includes(query) ||
        ta.email.toLowerCase().includes(query) ||
        ta.nsimNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Add the handleStatusFilterClick function inside the component
  const handleStatusFilterClick = (status: 'all' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INITIATED' |
    'WAITING_FOR_OTP_FROM_TA' | 'PENDING_VERIFICATION_FROM_ADMIN' |
    'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' | 'PENDING_TA_AGREEMENT' |
    'TA_AGREEMENT_INITIATED' | 'TA_AGREEMENT_SIGNED' |
    'ADMIN_AGREEMENT_SIGNATURE_INITIATED' | 'ADMIN_AGREEMENT_SIGNATURE_SIGNED' |
    'TA_AGREEMENT_REJECTED' | 'LOCKED') => {
    setStatusFilter(status);

    if (status === 'all') {
      // Fetch all TAs without status filter
      fetchTAs();
    } else {
      // Fetch TAs with the selected status
      fetchTAsByStatus(status);
    }
  };

  useEffect(() => {
    fetchTAs();
  }, []);

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
        ta.status === 'PENDING_VERIFICATION_FROM_ADMIN'
      ).length,
      updatedAgo: '10 minutes ago',
      approved: allTARegistrations.filter(ta =>
        ta.status === 'APPROVED_BY_ADMIN' || ta.status === 'ACTIVE'
      ).length,
      newThisWeek: allTARegistrations.filter(ta =>
        new Date(ta.registeredDate) >= firstDayOfWeek
      ).length,
      declined: allTARegistrations.filter(ta =>
        ta.status === 'REJECTED_BY_ADMIN' || ta.status === 'TA_AGREEMENT_REJECTED'
      ).length,
      declinedToday: allTARegistrations.filter(ta =>
        (ta.status === 'REJECTED_BY_ADMIN' || ta.status === 'TA_AGREEMENT_REJECTED') &&
        new Date(ta.registeredDate).toDateString() === new Date().toDateString()
      ).length,
      blocked: allTARegistrations.filter(ta =>
        ta.status === 'SUSPENDED' || ta.status === 'LOCKED'
      ).length,
      blockedToday: allTARegistrations.filter(ta =>
        (ta.status === 'SUSPENDED' || ta.status === 'LOCKED') &&
        new Date(ta.registeredDate).toDateString() === new Date().toDateString()
      ).length
    };
  };

  // Get current stats
  const dashboardStats = getDashboardStats();

  const handleViewTA = (taId: string) => {
    const ta = allTARegistrations.find(reg => reg.id === taId);
    if (ta) {
      // Convert TAUser to TARegistration for the modal
      const taRegistration: TARegistration = {
        id: ta.id,
        name: ta.name,
        email: ta.email,
        nsimNumber: ta.nsimNumber,
        registeredDate: ta.registeredDate,
        registeredTime: ta.registeredTime,
        status: ta.status, // Use the status directly without conversion
        verification: ta.verification,
        initials: ta.initials,
        phone: ta.phoneNumber,
        address: '',
        experience: '',
        education: '',
        documents: {
          aadhar: ta.aadhaarNumber,
          nsimDocumentKey: ta.nsimDocumentKey
        },
        allowedBuckets: []
      };
      setSelectedTA(taRegistration);
      setIsDetailModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTA(null);
  };

  const handleStatusChange = async (taId: string, newStatus: string) => {
    if (!userData || !userData.id) {
      console.error('Admin ID not found. User may not be logged in.');
      return;
    }

    try {
      const response = await adminService.updateTAStatus(
        parseInt(taId),
        newStatus,
        userData.id // Pass the admin ID from userData
      );

      if (response.status === 'SUCCESS') {
        setAllTARegistrations(prevTAs =>
          prevTAs.map(ta =>
            ta.id.toString() === taId
              ? { ...ta, status: newStatus as any }
              : ta
          )
        );
      } else {
        console.error(`Failed to update TA status to ${newStatus}:`, response.error);
      }
    } catch (error) {
      console.error(`Error updating TA status to ${newStatus}:`, error);
    }
    handleCloseModal();
  };

  const handleRequestOTP = (taId: string) => {
    console.log('Requesting OTP verification for TA:', taId);
    // Add your OTP request logic here
  };

  const handleViewStudies = async () => {
    if (!selectedTA) return;

    setLoadingStudies(true);
    setStudiesError(null);

    try {
      const response = await adminService.getStudiesByTaId(parseInt(selectedTA.id));

      if (response.status === 'SUCCESS' && response.data) {
        setStudies(response.data);
        setOpenStudyDialog(true);
      } else {
        setStudiesError(response.error || 'Failed to fetch studies');
      }
    } catch (error) {
      setStudiesError((error as Error).message || 'An error occurred while fetching studies');
    } finally {
      setLoadingStudies(false);
    }
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

  const handleLinkNsimAndApprove = async (taId: string) => {
    setLoadingNsimUsers(true);
    try {
      // Fetch users with NSIM documents
      const response = await adminService.getUsersByRoleAndStatus('TRUSTED_ASSOCIATE');
      if (response.status === 'SUCCESS' && response.data) {
        // Filter users who have NSIM documents
        const usersWithNsim = response.data.filter(user =>
          user.nsimDocumentKey != null && user.nsimDocumentKey !== ''
        );
        setNsimUsers(usersWithNsim);
        setOpenNsimLinkDialog(true);
      } else {
        setError(response.error || 'Failed to fetch users with NSIM documents');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred while fetching users with NSIM documents');
    } finally {
      setLoadingNsimUsers(false);
    }
  };

  const handleCloseNsimLinkDialog = () => {
    setOpenNsimLinkDialog(false);
    setSelectedNsimUser(null);
  };

  const handleSelectNsimUser = (user: TAUser) => {
    // If clicking on already selected user, deselect it
    if (selectedNsimUser?.id === user.id) {
      setSelectedNsimUser(null);
    } else {
      setSelectedNsimUser(user);
    }
  };

  const handleConfirmNsimLink = async () => {
    if (!selectedTA || !selectedNsimUser || !userData || !userData.id) {
      console.error('Missing required data for NSIM linking');
      return;
    }

    try {
      setLoading(true);
      const response = await adminService.linkNsimCertificate(
        parseInt(selectedTA.id),
        parseInt(selectedNsimUser.id)
      );

      if (response.status === 'SUCCESS') {
        // After successful linking, update the TA status to APPROVED_BY_ADMIN
        const statusResponse = await adminService.updateTAStatus(
          parseInt(selectedTA.id),
          'APPROVED_BY_ADMIN',
          userData.id
        );

        if (statusResponse.status === 'SUCCESS') {
          // Update the local state
          setAllTARegistrations(prevTAs =>
            prevTAs.map(ta =>
              ta.id === selectedTA.id
                ? {
                  ...ta,
                  status: 'APPROVED_BY_ADMIN',
                  nsimNumber: selectedNsimUser.nsimNumber,
                  nsimDocumentKey: selectedNsimUser.nsimDocumentKey
                }
                : ta
            )
          );

          // Close dialogs
          setOpenNsimLinkDialog(false);
          setIsDetailModalOpen(false);
          setSelectedNsimUser(null);
          setSelectedTA(null);

          // Show success message
          setError(null);
        } else {
          setError(statusResponse.error || 'Failed to update TA status after linking NSIM');
        }
      } else {
        setError(response.error || 'Failed to link NSIM certificate');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred while linking NSIM certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedWithAgreement = async (userId: string) => {
    try {
      setLoading(true);
      const response = await adminService.eSignAgreementByAdmin(parseInt(userId));

      if (response.status === 'SUCCESS' && response.data) {
        // Update the local state
        setAllTARegistrations(prevTAs =>
          prevTAs.map(ta =>
            ta.id === userId
              ? { ...ta, status: 'ADMIN_AGREEMENT_SIGNATURE_INITIATED' }
              : ta
          )
        );

        // Close the detail modal
        setIsDetailModalOpen(false);
        setSelectedTA(null);

        // Redirect to the e-sign URL
        if (response.data.eSignUrl) {
          window.open(response.data.eSignUrl, '_blank');
        } else {
          setError('E-sign URL not provided in the response');
        }
      } else {
        setError(response.error || 'Failed to initiate e-sign agreement');
      }
    } catch (error) {
      setError((error as Error).message || 'An error occurred while initiating e-sign agreement');
    } finally {
      setLoading(false);
    }
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

          {/* Display loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Display error message if any */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Rest of the UI */}
          {!loading && !error && (
            <>
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
                      bgcolor: statusFilter === 'PENDING_VERIFICATION_FROM_ADMIN' ? 'warning.light' : 'inherit',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleStatusFilterClick('PENDING_VERIFICATION_FROM_ADMIN')}
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
                      bgcolor: statusFilter === 'APPROVED_BY_ADMIN' ? 'success.light' : 'inherit',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleStatusFilterClick('APPROVED_BY_ADMIN')}
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
                      bgcolor: statusFilter === 'REJECTED_BY_ADMIN' ? 'error.light' : 'inherit',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleStatusFilterClick('REJECTED_BY_ADMIN')}
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
                      bgcolor: statusFilter === 'SUSPENDED' ? 'error.light' : 'inherit',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => handleStatusFilterClick('SUSPENDED')}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                        <CancelIcon />
                      </Avatar>
                      <Typography variant="h6">Suspended</Typography>
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
                    placeholder="Search by name, status, or email.  "
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
                        {/* <TableCell>NSIM NUMBER</TableCell> */}
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
                          {/* <TableCell>{registration.nsimNumber}</TableCell> */}
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
                                  registration.status === 'PENDING_VERIFICATION_FROM_ADMIN' ? 'warning' :
                                    registration.status === 'APPROVED_BY_ADMIN' || registration.status === 'ACTIVE' ? 'success' :
                                      registration.status === 'SUSPENDED' || registration.status === 'LOCKED' ? 'error' : 'default'
                                }
                                sx={{
                                  ...(registration.status === 'REJECTED_BY_ADMIN' || registration.status === 'TA_AGREEMENT_REJECTED' ? {
                                    bgcolor: 'grey.200',
                                    color: 'grey.700',
                                    borderColor: 'grey.400',
                                    '&:hover': {
                                      bgcolor: 'grey.300',
                                    }
                                  } : {}),
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
            </>
          )}
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
                      {/* <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          NSIM Number
                        </Typography>
                        <Typography variant="body1">{selectedTA.nsimNumber}</Typography>
                      </Grid> */}
                    </Grid>
                  </Paper>
                </Grid>

                {/* Professional Information */}
                {/* <Grid item xs={12}>
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
                </Grid> */}

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
              {(selectedTA.status === 'APPROVED_BY_ADMIN' || selectedTA.status === 'ACTIVE') && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange(selectedTA.id, 'SUSPENDED')}
                    sx={{ mx: 1 }}
                  >
                    Block
                  </Button>
                  {(selectedTA.status === 'APPROVED_BY_ADMIN' || selectedTA.status === 'ACTIVE') && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleStatusChange(selectedTA.id, 'PENDING_TA_AGREEMENT')}
                      sx={{ mx: 1 }}
                    >
                      Request Aggrement
                    </Button>
                  )}
                </>
              )}

              {/* Buttons for Approved Users */}
              {(selectedTA.status === 'PENDING_TA_AGREEMENT') && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusChange(selectedTA.id, 'SUSPENDED')}
                    sx={{ mx: 1 }}
                  >
                    Block
                  </Button>
                </>
              )}

              {/* Buttons for Blocked Users */}
              {(selectedTA.status === 'SUSPENDED' || selectedTA.status === 'LOCKED') && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange(selectedTA.id, 'APPROVED_BY_ADMIN')}
                  sx={{ mx: 1 }}
                >
                  Approve
                </Button>
              )}

              {/* Buttons for Pending User and with nsim cert */}
              {(selectedTA.status === 'PENDING_VERIFICATION_FROM_ADMIN' && selectedTA.documents?.nsimDocumentKey != null) && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusChange(selectedTA.id, 'REJECTED_BY_ADMIN')}
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
                    onClick={() => handleStatusChange(selectedTA.id, 'SUSPENDED')}
                    sx={{ mx: 1 }}
                  >
                    Block
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusChange(selectedTA.id, 'APPROVED_BY_ADMIN')}
                  >
                    Approve
                  </Button>
                </>
              )}


              {/* Buttons for pending and non nsim certificate users */}
              {(selectedTA.status === 'PENDING_VERIFICATION_FROM_ADMIN' && selectedTA.documents?.nsimDocumentKey == null) && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleLinkNsimAndApprove(selectedTA.id)}
                  sx={{ mx: 1 }}
                >
                  Link NSIM and Approve
                </Button>
              )}

              {/* Buttons for Declined Users */}
              {(selectedTA.status === 'REJECTED_BY_ADMIN' || selectedTA.status === 'TA_AGREEMENT_REJECTED') && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusChange(selectedTA.id, 'APPROVED_BY_ADMIN')}
                  sx={{ mx: 1 }}
                >
                  Approve
                </Button>
              )}

              {/* Buttons for TA_AGREEMENT_SIGNED status */}
              {selectedTA.status === 'TA_AGREEMENT_SIGNED' && (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleStatusChange(selectedTA.id, 'TA_AGREEMENT_REJECTED')}
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
                    variant="contained"
                    color="primary"
                    onClick={() => handleProceedWithAgreement(selectedTA.id)}
                    sx={{ mx: 1 }}
                  >
                    Proceed with Agreement
                  </Button>
                </>
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
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Submitted Studies - {selectedTA?.name}
            </Typography>
            {loadingStudies && (
              <CircularProgress size={24} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {studiesError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {studiesError}
            </Alert>
          )}

          {studies.length === 0 && !loadingStudies && !studiesError ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No studies found for this TA.
            </Alert>
          ) : (
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
                  {studies.map((study) => (
                    <TableRow key={study.id}>
                      <TableCell>{new Date(study.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{study.stockExchange}</TableCell>
                      <TableCell>{study.stockIndex}</TableCell>
                      <TableCell>{study.stockName}</TableCell>
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
          )}
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
                  Stock
                </Typography>
                <Typography variant="body1">
                  {selectedStudy.stockName}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Exchange
                </Typography>
                <Typography variant="body1">
                  {selectedStudy.stockExchange}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Index
                </Typography>
                <Typography variant="body1">
                  {selectedStudy.stockIndex}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Action
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: selectedStudy.action === 'BUY' ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  {selectedStudy.action}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Price
                </Typography>
                <Typography variant="body1">
                  ₹{selectedStudy.currentPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expected Price
                </Typography>
                <Typography variant="body1">
                  ₹{selectedStudy.expectedPrice.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Submitted Date
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedStudy.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Analysis
                </Typography>
                <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedStudy.analysis}
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

      {/* NSIM Link Dialog */}
      <Dialog
        open={openNsimLinkDialog}
        onClose={handleCloseNsimLinkDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Select NSIM Document to Link</DialogTitle>
        <DialogContent>
          {loadingNsimUsers ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="NSIM users table">
                    <TableHead>
                      <TableRow>
                        <TableCell>NAME</TableCell>
                        <TableCell>EMAIL</TableCell>
                        <TableCell>NSIM NUMBER</TableCell>
                        <TableCell>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nsimUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            bgcolor: selectedNsimUser?.id === user.id ? 'primary.lighter' : 'inherit'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                                {user.initials}
                              </Avatar>
                              <Stack>
                                <Typography variant="body1">{user.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {user.email}
                                </Typography>
                              </Stack>
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.nsimNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant={selectedNsimUser?.id === user.id ? "contained" : "outlined"}
                              color="primary"
                              onClick={() => handleSelectNsimUser(user)}
                              sx={{
                                bgcolor: selectedNsimUser?.id === user.id ? 'primary.main' : 'transparent',
                                color: selectedNsimUser?.id === user.id ? 'white' : 'primary.main',
                                '&:hover': {
                                  bgcolor: selectedNsimUser?.id === user.id ? 'primary.dark' : 'action.hover',
                                }
                              }}
                            >
                              {selectedNsimUser?.id === user.id ? "Selected" : "Select"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNsimLinkDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmNsimLink}
            disabled={!selectedNsimUser}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            Link and Approve
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default TaManagementPage;
