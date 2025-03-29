import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  CheckCircle as ExecutedIcon,
  AccessTime as PendingIcon,
  Visibility as VisibilityIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import TALayout from '../components/TALayout';

interface Call {
  id: string;
  stock: string;
  type: 'Buy' | 'Sell';
  entryPrice: number;
  exitPrice: number;
  target: number;
  stopLoss: number;
  date: string;
  time: string;
  status: 'Success' | 'Failure';
  reconciliationStatus: 'Completed' | 'Pending' | 'Not Started';
}

const Reconciliation: React.FC = () => {
  // Set default date range (current date to 30 days ago)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<Date | null>(thirtyDaysAgo);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Success' | 'Failure'>('all');
  const [reconciliationFilter, setReconciliationFilter] = useState<'all' | 'Completed' | 'Pending' | 'Not Started'>('all');
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // Updated mock data with more recent dates
  const [calls] = useState<Call[]>([
    {
      id: '1',
      stock: 'HDFC Bank',
      type: 'Buy',
      entryPrice: 1550,
      exitPrice: 1700,
      target: 1650,
      stopLoss: 1500,
      date: new Date().toISOString().split('T')[0], // Today
      time: '10:30 AM',
      status: 'Success',
      reconciliationStatus: 'Pending'
    },
    {
      id: '2',
      stock: 'TCS',
      type: 'Sell',
      entryPrice: 3800,
      exitPrice: 3750,
      target: 3700,
      stopLoss: 3850,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
      time: '11:15 AM',
      status: 'Failure',
      reconciliationStatus: 'Not Started'
    },
    {
      id: '3',
      stock: 'Reliance',
      type: 'Buy',
      entryPrice: 2400,
      exitPrice: 2450,
      target: 2500,
      stopLoss: 2350,
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days ago
      time: '3:45 PM',
      status: 'Success',
      reconciliationStatus: 'Completed'
    }
  ]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // Only select Not Started calls
      setSelectedCalls(getFilteredCalls()
        .filter(call => call.reconciliationStatus === 'Not Started')
        .map(call => call.id));
    } else {
      setSelectedCalls([]);
    }
  };

  const handleSelectCall = (id: string) => {
    setSelectedCalls(prev => {
      if (prev.includes(id)) {
        return prev.filter(callId => callId !== id);
      }
      return [...prev, id];
    });
  };

  const getFilteredCalls = () => {
    let filtered = calls;

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(call => {
        // Parse the date string from our data (YYYY-MM-DD)
        const callDate = new Date(call.date);
        // Create new Date objects for comparison to avoid mutating state
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Set hours for proper day comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        // Compare dates
        return callDate >= start && callDate <= end;
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    // Apply reconciliation status filter
    if (reconciliationFilter !== 'all') {
      filtered = filtered.filter(call => call.reconciliationStatus === reconciliationFilter);
    }

    return filtered;
  };

  const handleSubmitReconciliation = () => {
    setIsConfirmDialogOpen(false);
    setIsSuccessDialogOpen(true);
    // Here you would typically make an API call to update the reconciliation status
  };

  return (
    <TALayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Reconciliation Dashboard
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* Total Calls */}
            <Grid item xs={12} md={6} lg={3}>
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
                onClick={() => setStatusFilter('all')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <VisibilityIcon />
                  </Avatar>
                  <Typography variant="h6">Total Calls</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {calls.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All calls
                </Typography>
              </Paper>
            </Grid>

            {/* Success Calls */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Success' ? 'success.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setStatusFilter('Success')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <ExecutedIcon />
                  </Avatar>
                  <Typography variant="h6">Success</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {calls.filter(call => call.status === 'Success').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Successful calls
                </Typography>
              </Paper>
            </Grid>

            {/* Failed Calls */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Failure' ? 'error.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setStatusFilter('Failure')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <PendingIcon />
                  </Avatar>
                  <Typography variant="h6">Failed</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {calls.filter(call => call.status === 'Failure').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Failed calls
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Filters
              </Typography>
              <Button
                startIcon={<ResetIcon />}
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setStatusFilter('all');
                  setReconciliationFilter('all');
                }}
                size="small"
                color="primary"
                disabled={!startDate && !endDate && statusFilter === 'all'}
              >
                Reset All Filters
              </Button>
            </Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Success' | 'Failure')}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="Success">Success</MenuItem>
                    <MenuItem value="Failure">Failure</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Reconciliation Status</InputLabel>
                  <Select
                    value={reconciliationFilter}
                    label="Reconciliation Status"
                    onChange={(e) => setReconciliationFilter(e.target.value as 'all' | 'Completed' | 'Pending' | 'Not Started')}
                  >
                    <MenuItem value="all">All Reconciliation</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Not Started">Not Started</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Submit Reconciliation Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mb: 3,
            px: 1
          }}>
            <Button
              variant="contained"
              color="primary"
              disabled={selectedCalls.length === 0}
              onClick={() => setIsConfirmDialogOpen(true)}
              sx={{
                minWidth: '200px'
              }}
            >
              Submit Reconciliation
            </Button>
          </Box>

          {/* Updated Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '15%'
                  }}>STOCK</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '8%'
                  }}>TYPE</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '10%'
                  }}>ENTRY PRICE</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '10%'
                  }}>EXIT PRICE</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '10%'
                  }}>TARGET</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '10%'
                  }}>STOP LOSS</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '10%'
                  }}>DATE</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '8%'
                  }}>TIME</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '8%'
                  }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '8%'
                  }}>P/L</TableCell>
                  <TableCell sx={{ 
                    fontWeight: 600, 
                    color: '#1a2035',
                    fontSize: '0.875rem',
                    width: '8%'
                  }}>RECONCILIATION</TableCell>
                  <TableCell padding="checkbox" align="center" sx={{ width: '5%' }}>
                    <Checkbox
                      checked={
                        getFilteredCalls().filter(call => call.reconciliationStatus === 'Not Started').length > 0 &&
                        selectedCalls.length === getFilteredCalls().filter(call => call.reconciliationStatus === 'Not Started').length
                      }
                      indeterminate={
                        selectedCalls.length > 0 &&
                        selectedCalls.length < getFilteredCalls().filter(call => call.reconciliationStatus === 'Not Started').length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        color: '#1a2035',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                        '&.MuiCheckbox-indeterminate': {
                          color: 'primary.main',
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredCalls().map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.stock}</TableCell>
                    <TableCell>
                      <Chip 
                        label={call.type}
                        sx={{ 
                          color: call.type === 'Buy' ? '#2e7d32' : '#d32f2f',
                          bgcolor: 'transparent',
                          border: '1px solid',
                          borderColor: call.type === 'Buy' ? '#2e7d32' : '#d32f2f',
                          fontWeight: 500,
                          borderRadius: 1,
                          '& .MuiChip-label': {
                            px: 2
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">₹{call.entryPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{call.exitPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{call.target.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{call.stopLoss.toFixed(2)}</TableCell>
                    <TableCell>{new Date(call.date).toLocaleDateString('en-IN', { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</TableCell>
                    <TableCell>{call.time}</TableCell>
                    <TableCell>
                      <Chip 
                        label={call.status}
                        sx={{ 
                          color: call.status === 'Success' ? '#2e7d32' : '#d32f2f',
                          bgcolor: 'transparent',
                          border: '1px solid',
                          borderColor: call.status === 'Success' ? '#2e7d32' : '#d32f2f',
                          fontWeight: 500,
                          borderRadius: 1,
                          '& .MuiChip-label': {
                            px: 2,
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          color: call.exitPrice - call.entryPrice >= 0 ? '#2e7d32' : '#d32f2f',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {(call.exitPrice - call.entryPrice >= 0 ? '+' : '-')}₹{Math.abs(call.exitPrice - call.entryPrice).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={call.reconciliationStatus}
                        sx={{ 
                          color: 'white',
                          bgcolor: call.reconciliationStatus === 'Completed' ? '#4caf50' : 
                                  call.reconciliationStatus === 'Pending' ? '#ff9800' : '#757575',
                          fontWeight: 500,
                          borderRadius: 1
                        }}
                      />
                    </TableCell>
                    <TableCell padding="checkbox" align="center">
                      {call.reconciliationStatus === 'Not Started' && (
                        <Checkbox
                          checked={selectedCalls.includes(call.id)}
                          onChange={() => handleSelectCall(call.id)}
                          sx={{
                            color: '#1a2035',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            }
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Confirm Reconciliation
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected Calls for Reconciliation:
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
                      <TableCell align="right" sx={{ fontWeight: 600 }}>P/L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredCalls()
                      .filter(call => selectedCalls.includes(call.id))
                      .map((call) => (
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
                          <TableCell align="right">
                            <Typography
                              sx={{
                                color: call.exitPrice - call.entryPrice >= 0 ? '#2e7d32' : '#d32f2f',
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {(call.exitPrice - call.entryPrice >= 0 ? '+' : '-')}₹{Math.abs(call.exitPrice - call.entryPrice).toFixed(2)}
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
                    color: getFilteredCalls()
                      .filter(call => selectedCalls.includes(call.id))
                      .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0) >= 0 
                      ? '#2e7d32' 
                      : '#d32f2f',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {(getFilteredCalls()
                    .filter(call => selectedCalls.includes(call.id))
                    .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0) >= 0 
                    ? '+' 
                    : '-')}₹{Math.abs(getFilteredCalls()
                    .filter(call => selectedCalls.includes(call.id))
                    .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0))
                    .toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitReconciliation} variant="contained" color="primary">
              Confirm Reconciliation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <Dialog
          open={isSuccessDialogOpen}
          onClose={() => setIsSuccessDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h6">
              Submitted for Reconciliation
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              py: 3
            }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <ExecutedIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
              <Typography>
                Successfully reconciled {selectedCalls.length} calls.
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mt: 2,
                  fontWeight: 600,
                  color: getFilteredCalls()
                    .filter(call => selectedCalls.includes(call.id))
                    .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0) >= 0 
                    ? '#2e7d32' 
                    : '#d32f2f',
                  whiteSpace: 'nowrap'
                }}
              >
                Total Amount: {(getFilteredCalls()
                  .filter(call => selectedCalls.includes(call.id))
                  .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0) >= 0 
                  ? '+' 
                  : '-')}₹{Math.abs(getFilteredCalls()
                  .filter(call => selectedCalls.includes(call.id))
                  .reduce((sum, call) => sum + (call.exitPrice - call.entryPrice), 0))
                  .toFixed(2)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsSuccessDialogOpen(false);
                setSelectedCalls([]);
              }}
              variant="contained"
              color="primary"
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </TALayout>
  );
};

export default Reconciliation; 