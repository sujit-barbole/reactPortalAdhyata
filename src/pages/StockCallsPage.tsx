import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ThemeProvider,
  createTheme,
  Divider,
} from '@mui/material';
import { 
  ArrowBack, 
  FileDownload, 
  AccessTime as PendingIcon,
  CheckCircle as ExecutedIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircleOutline as SuccessIcon,
  CancelOutlined as FailureIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

interface StockCall {
  time: string;
  stock: string;
  type: 'Buy' | 'Sell';
  entryPrice: number;
  target: number;
  stopLoss: number;
  exitPrice?: number;
  id: string;
  status: 'Pending' | 'Executed';
  executedAt?: string;
  profit?: number;
  remarks?: string;
  taName: string;
  bucket: string;
  entryDateTime: string;
  exitDateTime?: string;
}

const StockCallsPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Executed'>('all');
  const [selectedCall, setSelectedCall] = useState<StockCall | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState<StockCall | null>(null);
  const [selectedCalls, setSelectedCalls] = useState<string[]>([]);
  const [calls, setCalls] = useState<StockCall[]>([
    {
      time: '10:15 AM',
      stock: 'RELIANCE',
      type: 'Buy',
      entryPrice: 2450.75,
      target: 2520.00,
      stopLoss: 2400.00,
      id: '1',
      status: 'Pending',
      taName: 'Anil Sharma',
      bucket: 'Basic Bucket',
      entryDateTime: 'Mar 21, 2024 10:15 AM',
    },
    {
      time: '11:30 AM',
      stock: 'HDFCBANK',
      type: 'Buy',
      entryPrice: 1678.30,
      target: 1720.00,
      stopLoss: 1650.00,
      id: '2',
      status: 'Executed',
      executedAt: '11:45 AM',
      profit: 41.70,
      remarks: 'Target achieved',
      taName: 'Ravi Patel',
      bucket: 'Basic Bucket',
      entryDateTime: 'Mar 21, 2024 11:30 AM',
      exitDateTime: 'Mar 21, 2024 11:45 AM'
    },
    {
      time: '12:45 PM',
      stock: 'INFY',
      type: 'Sell',
      entryPrice: 1456.25,
      target: 1420.00,
      stopLoss: 1470.00,
      id: '3',
      status: 'Executed',
      executedAt: '1:15 PM',
      profit: -13.75,
      remarks: 'Stop loss hit',
      taName: 'Rajesh Kumar',
      bucket: 'Basic Bucket',
      entryDateTime: 'Mar 21, 2024 12:45 PM',
      exitDateTime: 'Mar 21, 2024 1:15 PM'
    }
  ]);

  const getCallStats = () => {
    return {
      total: calls.length,
      pending: calls.filter(call => call.status === 'Pending').length,
      executed: calls.filter(call => call.status === 'Executed').length,
      profitable: calls.filter(call => call.profit && call.profit > 0).length
    };
  };

  const stats = getCallStats();

  const handleGenerateExcel = (id: string) => {
    console.log('Generating excel for call:', id);
    // Add Excel generation logic here
  };

  const handleGenerateAllExcel = () => {
    console.log('Generating excel for selected calls:', selectedCalls);
    // Add Excel generation logic here for the selected calls
  };

  const handleViewCall = (call: StockCall) => {
    setSelectedCall(call);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCall(null);
  };

  const handleEditClick = (call: StockCall) => {
    setEditingCall(call);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleSaveEdit = (updatedCall: StockCall) => {
    setCalls(prevCalls => 
      prevCalls.map(call => 
        call.id === updatedCall.id ? updatedCall : call
      )
    );
    setIsEditModalOpen(false);
    setEditingCall(null);
  };

  const getFilteredCalls = () => {
    if (statusFilter === 'all') return calls;
    return calls.filter(call => call.status === statusFilter);
  };

  const handleSelectCall = (id: string) => {
    setSelectedCalls(prev => {
      if (prev.includes(id)) {
        return prev.filter(callId => callId !== id);
      }
      return [...prev, id];
    });
  };

  const handleBulkSuccess = () => {
    setCalls(prevCalls => 
      prevCalls.map(call => 
        selectedCalls.includes(call.id) 
          ? {
              ...call,
              status: 'Executed',
              executedAt: new Date().toLocaleTimeString(),
              remarks: 'Target achieved',
              exitPrice: call.target,
              profit: call.type === 'Buy' 
                ? call.target - call.entryPrice 
                : call.entryPrice - call.target
            }
          : call
      )
    );
    setSelectedCalls([]);
  };

  const handleBulkFailure = () => {
    setCalls(prevCalls => 
      prevCalls.map(call => 
        selectedCalls.includes(call.id)
          ? {
              ...call,
              status: 'Executed',
              executedAt: new Date().toLocaleTimeString(),
              remarks: 'Stop loss hit',
              exitPrice: call.stopLoss,
              profit: call.type === 'Buy'
                ? call.stopLoss - call.entryPrice
                : call.entryPrice - call.stopLoss
            }
          : call
      )
    );
    setSelectedCalls([]);
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Stock Calls Of Day
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
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's calls
                </Typography>
              </Paper>
            </Grid>

            {/* Pending Calls */}
            <Grid item xs={12} md={6} lg={3}>
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
                onClick={() => setStatusFilter('Pending')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <PendingIcon />
                  </Avatar>
                  <Typography variant="h6">Pending</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.pending}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Awaiting execution
                </Typography>
              </Paper>
            </Grid>

            {/* Executed Calls */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: 140,
                  cursor: 'pointer',
                  bgcolor: statusFilter === 'Executed' ? 'success.light' : 'inherit',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setStatusFilter('Executed')}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <ExecutedIcon />
                  </Avatar>
                  <Typography variant="h6">Executed</Typography>
                </Box>
                <Typography variant="h3" component="div" gutterBottom>
                  {stats.executed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.profitable} profitable
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Calls Table */}
          <Box sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                {statusFilter === 'all' ? 'All Calls' : `${statusFilter} Calls`}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FileDownload />}
                  onClick={handleGenerateAllExcel}
                  disabled={selectedCalls.length === 0}
                >
                  Generate Excel {selectedCalls.length > 0 && `(${selectedCalls.length})`}
                </Button>
              </Box>
            </Box>
            
            <TableContainer 
              component={Paper}
              sx={{ 
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                borderRadius: 2,
                '& .MuiTableCell-root': {
                  py: 2,
                  px: 2,
                  fontSize: '0.875rem'
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 600, width: '15%' }}>TA NAME</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>BUCKET</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>STOCK</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>ENTRY PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>EXIT PRICE</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>TARGET</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '10%' }}>STOP LOSS</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '8%' }}>ACTIONS</TableCell>
                    <TableCell padding="checkbox" align="center" sx={{ width: '5%' }}>
                      <Checkbox
                        checked={getFilteredCalls().length > 0 && selectedCalls.length === getFilteredCalls().length}
                        indeterminate={selectedCalls.length > 0 && selectedCalls.length < getFilteredCalls().length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCalls(getFilteredCalls().map(c => c.id));
                          } else {
                            setSelectedCalls([]);
                          }
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredCalls().map((call) => (
                    <TableRow 
                      key={call.id}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'grey.50',
                          transition: 'background-color 0.2s'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{call.taName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={call.bucket}
                          size="small"
                          sx={{ 
                            bgcolor: call.bucket === 'Basic Bucket' ? 'primary.light' :
                                   call.bucket === 'Gold Bucket' ? 'warning.light' :
                                   call.bucket === 'Platinum Bucket' ? 'info.light' : 'secondary.light',
                            color: 'white',
                            fontWeight: 500,
                            minWidth: '100px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{call.stock}</TableCell>
                      <TableCell>
                        <Chip 
                          label={call.type}
                          color={call.type === 'Buy' ? 'success' : 'error'}
                          sx={{ 
                            color: 'white',
                            bgcolor: call.type === 'Buy' ? 'success.main' : 'error.main',
                            fontWeight: 500,
                            borderRadius: 1,
                            minWidth: '70px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>₹{call.entryPrice.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {call.exitPrice ? `₹${call.exitPrice.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>₹{call.target.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>₹{call.stopLoss.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={call.status}
                          color={call.status === 'Pending' ? 'warning' : 'success'}
                          sx={{ 
                            fontWeight: 500,
                            minWidth: '90px'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewCall(call)}
                              sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                width: '28px',
                                height: '28px',
                                '&:hover': { 
                                  bgcolor: 'primary.dark',
                                  transform: 'scale(1.05)',
                                  transition: 'transform 0.2s'
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Call">
                            <IconButton
                              size="small"
                              onClick={() => handleEditClick(call)}
                              sx={{ 
                                bgcolor: 'warning.main',
                                color: 'white',
                                width: '28px',
                                height: '28px',
                                '&:hover': { 
                                  bgcolor: 'warning.dark',
                                  transform: 'scale(1.05)',
                                  transition: 'transform 0.2s'
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell padding="checkbox" align="center">
                        <Checkbox
                          checked={selectedCalls.includes(call.id)}
                          onChange={() => handleSelectCall(call.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>

      {/* Call Details Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {selectedCall && (
          <>
            <DialogTitle sx={{ pb: 2 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {selectedCall.stock}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={selectedCall.type}
                        color={selectedCall.type === 'Buy' ? 'success' : 'error'}
                        size="small"
                        sx={{ 
                          color: 'white',
                          bgcolor: selectedCall.type === 'Buy' ? 'success.main' : 'error.main',
                          fontWeight: 500,
                          borderRadius: 1
                        }}
                      />
                      <Chip 
                        label={selectedCall.bucket}
                        size="small"
                        sx={{ 
                          bgcolor: selectedCall.bucket === 'Basic Bucket' ? 'primary.light' :
                                 selectedCall.bucket === 'Gold Bucket' ? 'warning.light' :
                                 selectedCall.bucket === 'Platinum Bucket' ? 'info.light' : 'secondary.light',
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Chip 
                  label={selectedCall.status}
                  color={selectedCall.status === 'Pending' ? 'warning' : 'success'}
                  sx={{ 
                    fontWeight: 500,
                    minWidth: '100px'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* TA Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      TA Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {selectedCall.taName}
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Entry Date & Time: {selectedCall.entryDateTime}
                            </Typography>
                            {selectedCall.exitDateTime && (
                              <Typography variant="body2" color="text.secondary">
                                Exit Date & Time: {selectedCall.exitDateTime}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Price Information */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Price Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Entry Price
                            </Typography>
                            <Typography variant="h5">
                              ₹{selectedCall.entryPrice.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Stop Loss
                            </Typography>
                            <Typography variant="h5">
                              ₹{selectedCall.stopLoss.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Target Price
                            </Typography>
                            <Typography variant="h5">
                              ₹{selectedCall.target.toFixed(2)}
                            </Typography>
                          </Box>
                          {selectedCall.exitPrice && (
                            <Box>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Exit Price
                              </Typography>
                              <Typography variant="h5">
                                ₹{selectedCall.exitPrice.toFixed(2)}
                              </Typography>
                              {selectedCall.profit && (
                                <Typography variant="body2" color={selectedCall.profit > 0 ? 'success.main' : 'error.main'}>
                                  Profit/Loss: ₹{Math.abs(selectedCall.profit).toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Additional Information */}
                {selectedCall.remarks && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        Additional Information
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedCall.remarks}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={handleCloseModal}>
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditClick(selectedCall)}
              >
                Edit Call
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Call Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {editingCall && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Edit Stock Call - {editingCall.stock}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Stock"
                      value={editingCall.stock}
                      onChange={(e) => setEditingCall({
                        ...editingCall,
                        stock: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={editingCall.type}
                        label="Type"
                        onChange={(e) => setEditingCall({
                          ...editingCall,
                          type: e.target.value as 'Buy' | 'Sell'
                        })}
                      >
                        <MenuItem value="Buy">Buy</MenuItem>
                        <MenuItem value="Sell">Sell</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Call Details (Read Only)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Entry Price"
                      type="number"
                      value={editingCall.entryPrice}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Typography>₹</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Target"
                      type="number"
                      value={editingCall.target}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Typography>₹</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Stop Loss"
                      type="number"
                      value={editingCall.stopLoss}
                      InputProps={{
                        readOnly: true,
                        startAdornment: <Typography>₹</Typography>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Exit Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Exit Price"
                      type="number"
                      value={editingCall.exitPrice || ''}
                      onChange={(e) => setEditingCall({
                        ...editingCall,
                        exitPrice: parseFloat(e.target.value)
                      })}
                      InputProps={{
                        startAdornment: <Typography>₹</Typography>
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveEdit(editingCall)}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AdminLayout>
  );
};

export default StockCallsPage; 