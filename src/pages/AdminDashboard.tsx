import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminLayout from '../components/AdminLayout';

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

interface Call {
  id: string;
  stockName: string;
  action: 'Buy' | 'Sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: 'Pending' | 'Executed';
  executionTime?: string;
}

interface TASuccessRate {
  id: string;
  name: string;
  bucket: string;
  currentRate: number;
  requiredRate: number;
  status: 'Below Threshold' | 'Warning';
}

interface ReconciliationRequest {
  id: string;
  taName: string;
  taId: string;
  submittedDate: string;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  calls: {
    id: string;
    stock: string;
    type: 'Buy' | 'Sell';
    entryPrice: number;
    exitPrice: number;
    date: string;
    pnl: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [reconciliationAmount, setReconciliationAmount] = useState<number | null>(null);
  const [selectedReconciliation, setSelectedReconciliation] = useState<ReconciliationRequest | null>(null);
  const [showReconciliationDetails, setShowReconciliationDetails] = useState(false);

  // Function to handle navigation to TA Management
  const handleTAManagementClick = () => {
    navigate('/tamanagement');
  };

  const handleReconciliationClick = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and show a mock amount
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReconciliationAmount(250000);
      setShowReconciliation(true);
    } catch (error) {
      console.error('Error fetching reconciliation amount:', error);
    }
  };

  const handleCloseReconciliation = () => {
    setShowReconciliation(false);
    setReconciliationAmount(null);
  };

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

  const pendingCalls: Call[] = [
    {
      id: '1',
      stockName: 'TCS',
      action: 'Buy',
      entryPrice: 3500,
      targetPrice: 3800,
      stopLoss: 3300,
      status: 'Pending'
    },
    {
      id: '2',
      stockName: 'HDFC Bank',
      action: 'Sell',
      entryPrice: 1600,
      targetPrice: 1500,
      stopLoss: 1700,
      status: 'Pending'
    }
  ];

  const executedCalls: Call[] = [
    {
      id: '3',
      stockName: 'Infosys',
      action: 'Buy',
      entryPrice: 1400,
      targetPrice: 1550,
      stopLoss: 1300,
      status: 'Executed',
      executionTime: '10:30 AM'
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

  // Mock data for TAs below threshold
  const belowThresholdTAs: TASuccessRate[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      bucket: 'Gold Bucket',
      currentRate: 58,
      requiredRate: 65,
      status: 'Below Threshold'
    },
    {
      id: '2',
      name: 'Priya Singh',
      bucket: 'Platinum Bucket',
      currentRate: 68,
      requiredRate: 75,
      status: 'Warning'
    }
  ];

  // Mock data for reconciliation requests
  const reconciliationRequests: ReconciliationRequest[] = [
    {
      id: '1',
      taName: 'John Doe',
      taId: 'TA123',
      submittedDate: '2024-03-21',
      totalAmount: 25000,
      status: 'Pending',
      calls: [
        {
          id: '1',
          stock: 'HDFC Bank',
          type: 'Buy',
          entryPrice: 1550,
          exitPrice: 1700,
          date: '2024-03-20',
          pnl: 1500
        },
        {
          id: '2',
          stock: 'TCS',
          type: 'Sell',
          entryPrice: 3800,
          exitPrice: 3750,
          date: '2024-03-19',
          pnl: -500
        }
      ]
    },
    {
      id: '2',
      taName: 'Jane Smith',
      taId: 'TA124',
      submittedDate: '2024-03-20',
      totalAmount: 15000,
      status: 'Pending',
      calls: [
        {
          id: '3',
          stock: 'Infosys',
          type: 'Buy',
          entryPrice: 1400,
          exitPrice: 1450,
          date: '2024-03-18',
          pnl: 500
        }
      ]
    }
  ];

  const handleViewReconciliation = (request: ReconciliationRequest) => {
    setSelectedReconciliation(request);
    setShowReconciliationDetails(true);
  };

  const handleApproveReconciliation = () => {
    // Here you would typically make an API call to approve the reconciliation
    setShowReconciliationDetails(false);
    setSelectedReconciliation(null);
  };

  const handleRejectReconciliation = () => {
    // Here you would typically make an API call to reject the reconciliation
    setShowReconciliationDetails(false);
    setSelectedReconciliation(null);
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Admin Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AccountBalanceIcon />}
              onClick={handleReconciliationClick}
              sx={{ minWidth: 200 }}
            >
              Total Amount to Reconcile
            </Button>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Welcome back, Admin
          </Typography>

          {/* Notifications */}
          <Box sx={{ mt: 3, mb: 4 }}>
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
            >
              Pending Stock Calls: There are {pendingCalls.length} calls pending for execution today.
            </Alert>
            <Alert
              severity="warning"
            >
              New TA Registration: There are {pendingRegistrations.length} pending registrations requiring review.
            </Alert>
          </Box>

          {/* Reconciliation Dialog */}
          <Dialog
            open={showReconciliation}
            onClose={handleCloseReconciliation}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                Total Amount to Reconcile
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="h4" component="div" sx={{ mt: 2, textAlign: 'center' }}>
                ₹{reconciliationAmount?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                This amount represents the total pending reconciliation for all transactions
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReconciliation}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Stock Calls Section */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Stock Calls Management</Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Pending Calls */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pending Calls for Today
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Stock</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Entry</TableCell>
                          <TableCell>Target</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingCalls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell>{call.stockName}</TableCell>
                            <TableCell>
                              <Chip
                                label={call.action}
                                color={call.action === 'Buy' ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>₹{call.entryPrice}</TableCell>
                            <TableCell>₹{call.targetPrice}</TableCell>
                            <TableCell>
                              <Chip
                                label={call.status}
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Executed Calls */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Executed Calls Today
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Stock</TableCell>
                          <TableCell>Action</TableCell>
                          <TableCell>Entry</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {executedCalls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell>{call.stockName}</TableCell>
                            <TableCell>
                              <Chip
                                label={call.action}
                                color={call.action === 'Buy' ? 'success' : 'error'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>₹{call.entryPrice}</TableCell>
                            <TableCell>{call.executionTime}</TableCell>
                            <TableCell>
                              <Chip
                                label={call.status}
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* TA Management Section */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">TA Management</Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Pending Registrations */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pending TA Registrations
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>NSIM</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingRegistrations.map((ta) => (
                          <TableRow key={ta.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                                  {ta.initials}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2">{ta.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {ta.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{ta.nsimNumber}</TableCell>
                            <TableCell>
                              <Chip
                                label={ta.status}
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Below Threshold TAs */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Below Threshold Success Rate
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Bucket</TableCell>
                          <TableCell>Success Rate</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {belowThresholdTAs.map((ta) => (
                          <TableRow key={ta.id}>
                            <TableCell>{ta.name}</TableCell>
                            <TableCell>{ta.bucket}</TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {ta.currentRate}% / {ta.requiredRate}%
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={ta.status}
                                color={ta.status === 'Below Threshold' ? 'error' : 'warning'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Add a button to navigate to TA Management page */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleTAManagementClick}
                    startIcon={<PeopleIcon />}
                  >
                    Go to TA Management
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Reconciliation Requests Section */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Reconciliation Requests</Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>TA Name</TableCell>
                    <TableCell>TA ID</TableCell>
                    <TableCell>Submitted Date</TableCell>
                    <TableCell align="right">Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reconciliationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.taName}</TableCell>
                      <TableCell>{request.taId}</TableCell>
                      <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            color: request.totalAmount >= 0 ? '#2e7d32' : '#d32f2f',
                            fontWeight: 500,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {(request.totalAmount >= 0 ? '+' : '-')}₹{Math.abs(request.totalAmount).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={request.status === 'Pending' ? 'warning' : request.status === 'Approved' ? 'success' : 'error'}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            borderWidth: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewReconciliation(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Reconciliation Details Dialog */}
        <Dialog
          open={showReconciliationDetails}
          onClose={() => setShowReconciliationDetails(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedReconciliation && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    Reconciliation Details
                  </Typography>
                  <Chip
                    label={selectedReconciliation.status}
                    color={selectedReconciliation.status === 'Pending' ? 'warning' : selectedReconciliation.status === 'Approved' ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderWidth: 1.5,
                    }}
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        TA Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedReconciliation.taName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        TA ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedReconciliation.taId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Submitted Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedReconciliation.submittedDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: selectedReconciliation.totalAmount >= 0 ? '#2e7d32' : '#d32f2f',
                          fontWeight: 600,
                        }}
                      >
                        {(selectedReconciliation.totalAmount >= 0 ? '+' : '-')}₹{Math.abs(selectedReconciliation.totalAmount).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1" gutterBottom>
                    Calls Included
                  </Typography>
                  <TableContainer component={Paper} sx={{ mt: 2, mb: 3 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Entry Price</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Exit Price</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>P/L</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedReconciliation.calls.map((call) => (
                          <TableRow key={call.id}>
                            <TableCell>{call.stock}</TableCell>
                            <TableCell>
                              <Chip
                                label={call.type}
                                size="small"
                                sx={{
                                  color: call.type === 'Buy' ? '#2e7d32' : '#d32f2f',
                                  bgcolor: 'transparent',
                                  border: '1px solid',
                                  borderColor: call.type === 'Buy' ? '#2e7d32' : '#d32f2f',
                                  fontWeight: 500,
                                  borderRadius: 1,
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">₹{call.entryPrice.toFixed(2)}</TableCell>
                            <TableCell align="right">₹{call.exitPrice.toFixed(2)}</TableCell>
                            <TableCell>
                              {new Date(call.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={call.pnl >= 0 ? 'Success' : 'Failure'}
                                size="small"
                                sx={{
                                  color: call.pnl >= 0 ? '#2e7d32' : '#d32f2f',
                                  bgcolor: 'transparent',
                                  border: '1px solid',
                                  borderColor: call.pnl >= 0 ? '#2e7d32' : '#d32f2f',
                                  fontWeight: 500,
                                  borderRadius: 1,
                                  '& .MuiChip-label': {
                                    px: 1
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                sx={{
                                  color: call.pnl >= 0 ? '#2e7d32' : '#d32f2f',
                                  fontWeight: 500,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {(call.pnl >= 0 ? '+' : '-')}₹{Math.abs(call.pnl).toFixed(2)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Total Amount to Reconcile:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: selectedReconciliation.calls.reduce((sum, call) => sum + call.pnl, 0) >= 0 ? '#2e7d32' : '#d32f2f',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {(selectedReconciliation.calls.reduce((sum, call) => sum + call.pnl, 0) >= 0 ? '+' : '-')}₹{Math.abs(selectedReconciliation.calls.reduce((sum, call) => sum + call.pnl, 0)).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowReconciliationDetails(false)}
                  color="inherit"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectReconciliation}
                  color="error"
                  variant="outlined"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApproveReconciliation}
                  variant="contained"
                  color="primary"
                >
                  Approve
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;
