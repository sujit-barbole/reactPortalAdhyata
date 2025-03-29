import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import TALayout from '../components/TALayout';
import CloseIcon from '@mui/icons-material/Close';

interface BucketProps {
  name: string;
  successRate: number;
  minDeposit: number;
  maxCalls: number | string;
  isLocked: boolean;
  onSubmit: () => void;
}

const Bucket: React.FC<BucketProps> = ({ name, successRate, minDeposit, maxCalls, isLocked, onSubmit }) => (
  <Card 
    sx={{ 
      height: '100%',
      bgcolor: isLocked ? '#f5f5f5' : 'white',
      position: 'relative',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid',
      borderColor: isLocked ? 'grey.300' : 'primary.main',
    }}
  >
    <CardContent>
      <Typography variant="h6" color="primary" sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
        {name}
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Success Rate Required:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {successRate}%
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Min Deposit:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ₹{minDeposit.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Status:
          </Typography>
          <Typography 
            variant="body2" 
            color={isLocked ? 'error' : 'success.main'}
            fontWeight="bold"
          >
            {isLocked ? 'Locked' : 'Unlocked'}
          </Typography>
        </Box>

        {!isLocked && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
              onClick={onSubmit}
            >
              Submit Stock Recommendation
            </Button>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const SuccessMessage: React.FC<{ data: any; onClose: () => void }> = ({ data, onClose }) => (
  <Paper 
    sx={{ 
      mt: 3, 
      bgcolor: '#f0fdf4',
      p: 3,
      borderRadius: 2,
      position: 'relative',
      border: '1px solid',
      borderColor: 'success.light'
    }}
  >
    <IconButton
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'text.secondary'
      }}
    >
      <CloseIcon />
    </IconButton>
    
    <Typography variant="h6" color="success.main" sx={{ fontSize: '1.5rem', mb: 1 }}>
      Call Submitted Successfully!
    </Typography>
    
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Your call has been created and sent for review in {data.bucket}.
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'primary.main' 
          }} />
          <Typography variant="body1">
            Stock: {data.stockName}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'success.main' 
          }} />
          <Typography variant="body1">
            Call Type: {data.action}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'warning.main' 
          }} />
          <Typography variant="body1">
            Entry Price: ₹{data.entryPrice}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'success.main' 
          }} />
          <Typography variant="body1">
            Target: ₹{data.targetPrice}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'error.main' 
          }} />
          <Typography variant="body1">
            Stop Loss: ₹{data.stopLoss}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: 'info.main' 
          }} />
          <Typography variant="body1">
            Bucket: {data.bucket}
          </Typography>
        </Box>
      </Grid>
    </Grid>

    <Button 
      onClick={onClose}
      variant="contained"
      sx={{ 
        mt: 3,
        bgcolor: 'success.main',
        color: 'white',
        '&:hover': {
          bgcolor: 'success.dark'
        },
        textTransform: 'none',
        fontSize: '1rem',
        py: 1,
        px: 3,
        borderRadius: 2
      }}
    >
      Make Another Call
    </Button>
  </Paper>
);

const ErrorMessage: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <Paper 
    sx={{ 
      mt: 3, 
      bgcolor: '#fef2f2',
      p: 3,
      borderRadius: 2,
      position: 'relative',
      border: '1px solid',
      borderColor: 'error.light'
    }}
  >
    <IconButton
      onClick={onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: 'text.secondary'
      }}
    >
      <CloseIcon />
    </IconButton>

    <Typography variant="h6" color="error.main" sx={{ fontSize: '1.5rem', mb: 1 }}>
      Submission Failed
    </Typography>
    
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {message}
    </Typography>

    <Button 
      onClick={onClose}
      variant="contained"
      sx={{ 
        bgcolor: 'error.main',
        color: 'white',
        '&:hover': {
          bgcolor: 'error.dark'
        },
        textTransform: 'none',
        fontSize: '1rem',
        py: 1,
        px: 3,
        borderRadius: 2
      }}
    >
      Try Again
    </Button>
  </Paper>
);

const StockForm: React.FC<{ open: boolean; onClose: () => void; onSubmit: (data: any) => void }> = ({ open, onClose, onSubmit }) => {
  const [stockName, setStockName] = useState<string | null>(null);
  const [entryPrice, setEntryPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [action, setAction] = useState<string>('Buy');

  // Reset form function
  const resetForm = () => {
    setStockName(null);
    setEntryPrice('');
    setTargetPrice('');
    setStopLoss('');
    setAction('Buy');
  };

  // Handle dialog close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculatePotentialReturn = () => {
    if (!entryPrice || !targetPrice) return 0;
    const entry = parseFloat(entryPrice);
    const target = parseFloat(targetPrice);
    if (isNaN(entry) || isNaN(target)) return 0;
    
    if (action === 'Buy') {
      return ((target - entry) / entry * 100).toFixed(2);
    } else {
      return ((entry - target) / entry * 100).toFixed(2);
    }
  };

  const calculatePotentialLoss = () => {
    if (!entryPrice || !stopLoss) return 0;
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    if (isNaN(entry) || isNaN(stop)) return 0;
    
    if (action === 'Buy') {
      return ((entry - stop) / entry * 100).toFixed(2);
    } else {
      return ((stop - entry) / entry * 100).toFixed(2);
    }
  };

  const stockOptions = [
    { label: 'RELIANCE', value: 'RELIANCE' },
    { label: 'TCS', value: 'TCS' },
    { label: 'INFOSYS', value: 'INFOSYS' },
    { label: 'HDFC BANK', value: 'HDFC BANK' },
    { label: 'ICICI BANK', value: 'ICICI BANK' },
    { label: 'HINDUSTAN UNILEVER', value: 'HINDUSTAN UNILEVER' },
    { label: 'BHARTI AIRTEL', value: 'BHARTI AIRTEL' },
    { label: 'KOTAK MAHINDRA BANK', value: 'KOTAK MAHINDRA BANK' },
    { label: 'STATE BANK OF INDIA', value: 'STATE BANK OF INDIA' },
    { label: 'WIPRO', value: 'WIPRO' },
  ];

  const handleSubmit = () => {
    if (stockName) {
      onSubmit({ stockName, entryPrice, targetPrice, stopLoss, action });
      handleClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2,
          fontSize: '1.5rem',
          fontWeight: 500
        }}
      >
        Submit Stock Recommendation
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mt: 2 }}>
          <Select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              height: 56,
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem value="Buy">Buy</MenuItem>
            <MenuItem value="Sell">Sell</MenuItem>
          </Select>

          <Autocomplete
            options={stockOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event: React.ChangeEvent<{}>, newValue: { label: string; value: string } | null) => 
              setStockName(newValue ? newValue.value : null)
            }
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="Select Stock"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
            )}
          />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Entry Price (₹)
              </Typography>
              <TextField
                fullWidth
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Target Price (₹)
              </Typography>
              <TextField
                fullWidth
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Stop Loss (₹)
              </Typography>
              <TextField
                fullWidth
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: 56,
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#F8FAFF',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Potential Return:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="success.main"
                    fontWeight="bold"
                  >
                    {calculatePotentialReturn()}%
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#FFF8F8',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Potential Loss:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="error.main"
                    fontWeight="bold"
                  >
                    {calculatePotentialLoss()}%
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ 
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            color: 'text.primary',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
              bgcolor: 'transparent'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{ 
            px: 4,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TADashboard: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const currentStats = {
    successRate: 72,
  };

  const getSuccessRateStatus = (currentRate: number, requiredRate: number) => {
    if (currentRate >= requiredRate) {
      return { text: 'Achieved', color: 'success.main', bg: 'success.light' };
    }
    const difference = requiredRate - currentRate;
    if (difference <= 10) {
      return { text: 'Almost There', color: 'warning.main', bg: 'warning.light' };
    }
    return { text: 'Need Improvement', color: 'error.main', bg: 'error.light' };
  };

  const handleFormSubmit = (data: any) => {
    if (data.stockName === 'RELIANCE') {
      setErrorMessage('This stock has already been submitted today. Please try a different stock.');
      setSnackbarMessage('Duplicate stock submission detected');
      setSnackbarOpen(true);
    } else {
      // Find the current bucket based on success rate
      const currentBucket = buckets.find(bucket => 
        !bucket.isLocked && currentStats.successRate >= bucket.successRate
      );
      
      setSubmissionData({
        ...data,
        bucket: currentBucket?.name || 'Basic Bucket'
      });
      setSuccessMessage(`Call Submitted Successfully! Your call for ${data.stockName} has been created.`);
      setSnackbarMessage(`Stock recommendation submitted successfully to ${currentBucket?.name || 'Basic Bucket'}`);
      setSnackbarOpen(true);
    }
  };

  const buckets = [
    {
      name: 'Basic Bucket',
      successRate: 50,
      minDeposit: 0,
      maxCalls: 3,
      isLocked: false,
      status: 'Available'
    },
    {
      name: 'Gold Bucket',
      successRate: 65,
      minDeposit: 10000,
      maxCalls: 5,
      isLocked: false,
      status: 'Available'
    },
    {
      name: 'Platinum Bucket',
      successRate: 75,
      minDeposit: 20000,
      maxCalls: 10,
      isLocked: true,
      status: 'Locked'
    },
    {
      name: 'Diamond Bucket',
      successRate: 85,
      minDeposit: 50000,
      maxCalls: 'Unlimited',
      isLocked: true,
      status: 'Locked'
    }
  ];

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
            Trading Advisory Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: 'text.secondary',
            mb: 3
          }}>
            Create and manage stock recommendations
          </Typography>

          <Grid container spacing={2}>
            {buckets.filter(bucket => !bucket.isLocked).map((bucket) => {
              const status = getSuccessRateStatus(currentStats.successRate, bucket.successRate);
              return (
                <Grid item xs={12} sm={6} md={3} key={bucket.name}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'white',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'primary.light',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 2,
                      borderRadius: 2,
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      minWidth: 80,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5
                    }}>
                      {bucket.successRate}%
                    </Box>
                    <Box>
                      <Typography variant="body1" color="text.secondary">
                        {bucket.name}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>
                        {status.text}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Typography variant="h5" sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 600,
          mb: 1,
          color: '#1a2035'
        }}>
          Select a Bucket
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Choose from eligible buckets based on your success rate
        </Typography>

        <Grid container spacing={3}>
          {buckets.map((bucket) => (
            <Grid item xs={12} md={6} lg={3} key={bucket.name}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: bucket.isLocked ? 'grey.200' : 'primary.main',
                bgcolor: bucket.isLocked ? 'grey.50' : 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: bucket.isLocked ? 'grey.200' : 'primary.50',
                  color: bucket.isLocked ? 'text.secondary' : 'primary.main',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem'
                }}>
                  {bucket.status}
                </Box>

                <Typography variant="h6" color="primary" sx={{ 
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  mb: 3
                }}>
                  {bucket.name}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {bucket.successRate}%
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Min Deposit:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      ₹{bucket.minDeposit.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Max Calls:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {bucket.maxCalls}
                    </Typography>
                  </Box>
                </Box>

                {bucket.isLocked ? (
                  <Typography 
                    variant="body2" 
                    align="center"
                    sx={{ 
                      color: 'text.secondary',
                      bgcolor: 'grey.100',
                      py: 1,
                      borderRadius: 1
                    }}
                  >
                    Increase success rate to unlock
                  </Typography>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setFormOpen(true)}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Submit Recommendation
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <StockForm 
          open={formOpen} 
          onClose={() => setFormOpen(false)} 
          onSubmit={handleFormSubmit} 
        />

        {successMessage && submissionData && (
          <SuccessMessage data={submissionData} onClose={() => setSuccessMessage('')} />
        )}

        {errorMessage && (
          <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={errorMessage ? 'error' : 'success'}
            sx={{ 
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              '& .MuiAlert-icon': {
                fontSize: '2rem'
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </TALayout>
  );
};

export default TADashboard;