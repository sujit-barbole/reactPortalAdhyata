import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import TALayout from '../components/TALayout';

interface CallHistoryItem {
  id: string;
  stockName: string;
  action: 'Buy' | 'Sell';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  submittedDate: string;
  bucket: string;
  status: 'Pending' | 'Successful' | 'Failed';
  actualReturn?: number;
  exitPrice?: number;
}

const CallHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data for call history
  const mockCallHistory: CallHistoryItem[] = [
    {
      id: '1',
      stockName: 'TCS',
      action: 'Buy',
      entryPrice: 3500,
      targetPrice: 3800,
      stopLoss: 3300,
      submittedDate: '2024-03-21',
      bucket: 'Gold Bucket',
      status: 'Successful',
      actualReturn: 8.5,
    },
    {
      id: '2',
      stockName: 'HDFC BANK',
      action: 'Sell',
      entryPrice: 1600,
      targetPrice: 1500,
      stopLoss: 1700,
      submittedDate: '2024-03-20',
      bucket: 'Basic Bucket',
      status: 'Failed',
      actualReturn: -3.2,
    },
    {
      id: '3',
      stockName: 'INFOSYS',
      action: 'Buy',
      entryPrice: 1400,
      targetPrice: 1550,
      stopLoss: 1300,
      submittedDate: '2024-03-20',
      bucket: 'Gold Bucket',
      status: 'Pending',
    },
  ];

  const getFilteredCalls = () => {
    let filtered = mockCallHistory;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(call => 
        call.stockName.toLowerCase().includes(query)
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(call => {
        const callDate = dayjs(call.submittedDate).startOf('day');
        const selectedDateStart = selectedDate.startOf('day');
        return callDate.isSame(selectedDateStart);
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    return filtered;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'success';
      case 'Failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleViewCall = (call: CallHistoryItem) => {
    setSelectedCall(call);
    setIsDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDate(null);
    setStatusFilter('all');
  };

  return (
    <TALayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ 
            fontSize: '2rem', 
            fontWeight: 600,
            color: '#1a2035',
            mb: 1
          }}>
            Call History
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            View and track all your submitted stock recommendations
          </Typography>
        </Box>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Filters
            </Typography>
            <Button
              startIcon={<ResetIcon />}
              onClick={handleResetFilters}
              size="small"
              color="primary"
              disabled={!searchQuery && !selectedDate && statusFilter === 'all'}
            >
              Reset All Filters
            </Button>
          </Box>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by stock name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Filter by date"
                  value={selectedDate}
                  onChange={(newValue: Dayjs | null) => setSelectedDate(newValue)}
                  disableFuture
                  closeOnSelect
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        endAdornment: selectedDate && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSelectedDate(null)}
                              edge="end"
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    },
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          borderRadius: 2,
                        }
                      }
                    },
                    day: {
                      sx: {
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          }
                        }
                      }
                    },
                    actionBar: {
                      actions: ['clear', 'accept'],
                      sx: {
                        padding: 1,
                        '& .MuiButton-root': {
                          textTransform: 'none',
                          borderRadius: 1.5,
                          px: 2,
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon color="action" />
                    </InputAdornment>
                  }
                  endAdornment={
                    statusFilter !== 'all' && (
                      <IconButton
                        size="small"
                        onClick={() => setStatusFilter('all')}
                        sx={{ mr: 2 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Successful">Successful</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Calls Grid */}
        <Grid container spacing={3}>
          {getFilteredCalls().map((call) => (
            <Grid item xs={12} md={6} lg={4} key={call.id}>
              <Card sx={{ 
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: 'grey.100',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },
              }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.5,
                    bgcolor: call.action === 'Buy' ? 'success.soft' : 'error.soft',
                    borderRadius: 1,
                  }}>
                    {call.action === 'Buy' ? (
                      <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: '1.1rem' }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: '1.1rem' }} />
                    )}
                    <Typography 
                      variant="body2" 
                      fontWeight="500"
                      color={call.action === 'Buy' ? 'success.main' : 'error.main'}
                    >
                      {call.action}
                    </Typography>
                  </Box>
                  <Chip 
                    label={call.status}
                    color={getStatusColor(call.status)}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      px: 1,
                      borderWidth: 1.5,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        mb: 0.5
                      }}>
                        {call.stockName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(call.submittedDate).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1.5,
                    mb: 1.5,
                  }}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Entry
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                        ₹{call.entryPrice}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Target
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                        ₹{call.targetPrice}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Stop Loss
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                        ₹{call.stopLoss}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Exit
                      </Typography>
                      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 600 }}>
                        {call.exitPrice ? `₹${call.exitPrice}` : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    bgcolor: 'primary.soft',
                    borderRadius: 1,
                    mb: 1,
                  }}>
                    <Typography variant="body2" color="primary">
                      {call.bucket}
                    </Typography>
                    {call.status !== 'Pending' && (
                      <Typography 
                        variant="body2" 
                        fontWeight="600"
                        color={call.actualReturn && call.actualReturn > 0 ? 'success.main' : 'error.main'}
                      >
                        {call.actualReturn}% Return
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() => handleViewCall(call)}
                    startIcon={<VisibilityIcon />}
                    fullWidth
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'primary.soft',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Call Details Modal */}
        <Dialog
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedCall && (
            <>
              <DialogTitle sx={{ 
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'grey.100',
                bgcolor: 'grey.50'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 0.5
                    }}>
                      {selectedCall.stockName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(selectedCall.submittedDate).format('MMMM D, YYYY')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      px: 2,
                      py: 0.75,
                      bgcolor: selectedCall.action === 'Buy' ? 'success.soft' : 'error.soft',
                      borderRadius: 2,
                    }}>
                      {selectedCall.action === 'Buy' ? (
                        <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                      ) : (
                        <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                      )}
                      <Typography 
                        variant="body1" 
                        fontWeight="500"
                        color={selectedCall.action === 'Buy' ? 'success.main' : 'error.main'}
                      >
                        {selectedCall.action} Call
                      </Typography>
                    </Box>
                    <Chip 
                      label={selectedCall.status}
                      color={getStatusColor(selectedCall.status)}
                      size="medium"
                      variant="outlined"
                      sx={{ 
                        fontWeight: 500,
                        borderWidth: 1.5,
                      }}
                    />
                  </Box>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 2,
                      mb: 3
                    }}>
                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100'
                      }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Entry Price
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                          ₹{selectedCall.entryPrice}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100'
                      }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Target Price
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                          ₹{selectedCall.targetPrice}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100'
                      }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Stop Loss
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                          ₹{selectedCall.stopLoss}
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        textAlign: 'center', 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.100'
                      }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Exit Price
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                          {selectedCall.exitPrice ? `₹${selectedCall.exitPrice}` : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'primary.soft',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'primary.light'
                    }}>
                      <Box>
                        <Typography variant="body2" color="primary" gutterBottom>
                          Bucket
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {selectedCall.bucket}
                        </Typography>
                      </Box>
                      {selectedCall.status !== 'Pending' && (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="primary" gutterBottom>
                            Actual Return
                          </Typography>
                          <Typography 
                            variant="h6" 
                            fontWeight="600"
                            color={selectedCall.actualReturn && selectedCall.actualReturn > 0 ? 'success.main' : 'error.main'}
                          >
                            {selectedCall.actualReturn}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ 
                p: 3,
                borderTop: '1px solid',
                borderColor: 'grey.100',
                bgcolor: 'grey.50'
              }}>
                <Button 
                  onClick={() => setIsDetailModalOpen(false)}
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </TALayout>
  );
};

export default CallHistory; 