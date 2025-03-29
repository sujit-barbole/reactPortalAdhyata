import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
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
  InputAdornment,
} from '@mui/material';
import { 
  CloudUpload as CloudUploadIcon,
  FileDownload,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
  balance: number;
  status: 'Active' | 'Inactive';
  joinedDate: string;
  lastTransaction: string;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  initials: string;
}

const InvestorManagement: React.FC = () => {
  const [status, setStatus] = useState('Ready to upload');
  const [file, setFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadStats, setUploadStats] = useState({ filename: '', recordsProcessed: 0 });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      accountNumber: 'ACC-001',
      balance: 250000,
      status: 'Active',
      joinedDate: 'Jan 15, 2024',
      lastTransaction: 'Mar 20, 2024',
      totalInvested: 500000,
      currentValue: 575000,
      profitLoss: 75000,
      initials: 'RS'
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98765 43211',
      accountNumber: 'ACC-002',
      balance: 150000,
      status: 'Active',
      joinedDate: 'Feb 1, 2024',
      lastTransaction: 'Mar 19, 2024',
      totalInvested: 300000,
      currentValue: 315000,
      profitLoss: 15000,
      initials: 'PP'
    },
    {
      id: '3',
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 98765 43212',
      accountNumber: 'ACC-003',
      balance: 0,
      status: 'Inactive',
      joinedDate: 'Mar 15, 2024',
      lastTransaction: '-',
      totalInvested: 0,
      currentValue: 0,
      profitLoss: 0,
      initials: 'AK'
    }
  ]);
  const navigate = useNavigate();
  const [highlightedCard, setHighlightedCard] = useState<'total' | 'active' | 'balance' | 'pl' | null>(null);

  const getInvestorStats = () => {
    return {
      total: investors.length,
      active: investors.filter(inv => inv.status === 'Active').length,
      inactive: investors.filter(inv => inv.status === 'Inactive').length,
      totalBalance: investors.reduce((sum, inv) => sum + inv.balance, 0),
      totalProfitLoss: investors.reduce((sum, inv) => sum + inv.profitLoss, 0)
    };
  };

  const stats = getInvestorStats();

  const handleGenerateExcel = (id: string) => {
    console.log('Generating excel for investor:', id);
    // Add Excel generation logic here
  };

  const handleGenerateAllExcel = () => {
    console.log('Generating excel for selected investors:', selectedInvestors);
    // Add Excel generation logic here for the selected investors
  };

  const handleViewInvestor = (investor: Investor) => {
    setSelectedInvestor(investor);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInvestor(null);
  };

  const handleEditClick = (investor: Investor) => {
    setSelectedInvestor(investor);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleSaveEdit = (updatedInvestor: Investor) => {
    setInvestors(prevInvestors => 
      prevInvestors.map(inv => 
        inv.id === updatedInvestor.id ? updatedInvestor : inv
      )
    );
    setIsEditModalOpen(false);
    setSelectedInvestor(null);
  };

  const getFilteredInvestors = () => {
    let filtered = investors;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.name.toLowerCase().includes(query) ||
        inv.email.toLowerCase().includes(query) ||
        inv.accountNumber.toLowerCase().includes(query) ||
        inv.phone.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const handleSelectInvestor = (id: string) => {
    setSelectedInvestors(prev => {
      if (prev.includes(id)) {
        return prev.filter(invId => invId !== id);
      }
      return [...prev, id];
    });
  };

  const handleSendEmail = (investor: Investor) => {
    console.log('Sending email to:', investor.email);
    // Add email sending logic here
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      // Check file type
      if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
        setStatus('Error: Please upload only Excel files (.xlsx or .xls)');
        return;
      }
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setStatus('Error: File size should not exceed 10MB');
        return;
      }
      setFile(uploadedFile);
      setStatus('File selected: ' + uploadedFile.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (file) {
      try {
        setStatus('Uploading...');
        // Add your API call here
        // const response = await uploadInvestorData(file);
        
        // Simulate successful upload
        setUploadStats({
          filename: file.name,
          recordsProcessed: 128 // This would come from your API response
        });
        setIsSuccess(true);
        setIsUploadModalOpen(false); // Close the modal on success
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleUploadAnother = () => {
    setFile(null);
    setIsSuccess(false);
    setStatus('Ready to upload');
  };

  const handleSendEmailToAll = async () => {
    try {
      setIsSendingEmail(true);
      // Here you would make an API call to trigger emails
      // await sendEmailToAllInvestors();
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setStatus('Emails sent successfully to all investors');
    } catch (error) {
      setStatus('Error: Failed to send emails');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleCardClick = (cardType: 'total' | 'active' | 'balance' | 'pl') => {
    setHighlightedCard(cardType);
    switch (cardType) {
      case 'total':
        setStatusFilter('all');
        break;
      case 'active':
        setStatusFilter('Active');
        break;
      case 'balance':
        setStatusFilter('Inactive');
        break;
      case 'pl':
        setStatusFilter('all');
        break;
    }
  };

  const successContent = (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Paper
          sx={{
            mt: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Upload Status
          </Typography>

          <Box sx={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%', 
            bgcolor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}>
            <CheckCircleIcon sx={{ fontSize: 50, color: '#4caf50' }} />
          </Box>

          <Typography variant="h4" color="#4caf50" gutterBottom>
            Validation Successful
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your investor data has been validated and stored successfully
          </Typography>

          <Box sx={{ 
            mt: 3, 
            p: 3, 
            bgcolor: '#f8f9fa', 
            borderRadius: 1, 
            width: '100%',
            mb: 4
          }}>
            <Typography variant="body1" gutterBottom>
              Filename: {uploadStats.filename}
            </Typography>
            <Typography variant="body1">
              Records processed: {uploadStats.recordsProcessed}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              sx={{ px: 4 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUploadAnother}
              sx={{ px: 4 }}
            >
              Upload Another
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );

  const uploadContent = (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Investor Data
        </Typography>

        <Paper
          sx={{
            mt: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 8,
              width: '100%',
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(0, 0, 0, 0.01)'
              }
            }}
          >
            <input {...getInputProps()} />
            <IconButton
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main'
                }
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? 'Drop the Excel sheet here'
                : 'Drag and drop Excel sheet here'}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              or
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                const input = document.querySelector('input');
                if (input) input.click();
              }}
            >
              Browse Files
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
              Supported format: .xlsx, .xls (Max 10MB)
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, px: 4, py: 1.5 }}
            disabled={!file}
            onClick={handleUpload}
          >
            Upload Investor Data
          </Button>
        </Paper>

        <Paper
          sx={{
            mt: 4,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            bgcolor: '#f8f9fa'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Mass Email Communication
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            Send a system-generated email to all registered investors
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendEmailToAll}
            disabled={isSendingEmail}
            sx={{
              px: 4,
              py: 1.5,
              minWidth: 200,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {isSendingEmail ? 'Sending...' : 'Send Email to All Investors'}
          </Button>
        </Paper>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, width: '100%' }}>
          <Typography variant="body1" color="text.secondary">
            Status: {status}
          </Typography>
        </Box>
      </Box>
    </Container>
  );

  const investorListContent = (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Investor Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Investor Data
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {/* Total Investors */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                cursor: 'pointer',
                bgcolor: highlightedCard === 'total' ? 'primary.light' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleCardClick('total')}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Typography variant="h6">Total Investors</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registered investors
              </Typography>
            </Paper>
          </Grid>

          {/* Active Investors */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                cursor: 'pointer',
                bgcolor: highlightedCard === 'active' ? 'success.light' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleCardClick('active')}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Typography variant="h6">Active</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active accounts
              </Typography>
            </Paper>
          </Grid>

          {/* Total Balance */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                cursor: 'pointer',
                bgcolor: highlightedCard === 'balance' ? 'error.light' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleCardClick('balance')}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                ₹{stats.totalBalance.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current balance
              </Typography>
            </Paper>
          </Grid>

          {/* Total P/L */}
          <Grid item xs={12} md={6} lg={3}>
            <Paper 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                height: 140,
                cursor: 'pointer',
                bgcolor: highlightedCard === 'pl' ? 'warning.light' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleCardClick('pl')}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Typography variant="h6">Total P/L</Typography>
              </Box>
              <Typography variant="h3" component="div" gutterBottom>
                ₹{stats.totalProfitLoss.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overall profit/loss
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Investors Table */}
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {statusFilter === 'all' ? 'All Investors' : `${statusFilter} Investors`}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search investors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Inactive')}
                  sx={{ height: 40 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmailIcon />}
                onClick={handleSendEmailToAll}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? 'Sending...' : 'Send Email to All'}
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Total Invested</TableCell>
                  <TableCell>Current Value</TableCell>
                  <TableCell>P/L</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell padding="checkbox" align="center">
                    <Checkbox
                      checked={getFilteredInvestors().length > 0 && selectedInvestors.length === getFilteredInvestors().length}
                      indeterminate={selectedInvestors.length > 0 && selectedInvestors.length < getFilteredInvestors().length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvestors(getFilteredInvestors().map(inv => inv.id));
                        } else {
                          setSelectedInvestors([]);
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredInvestors().map((investor) => (
                  <TableRow key={investor.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: 'primary.light' }}>
                          {investor.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{investor.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {investor.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{investor.accountNumber}</TableCell>
                    <TableCell>₹{investor.balance.toLocaleString()}</TableCell>
                    <TableCell>₹{investor.totalInvested.toLocaleString()}</TableCell>
                    <TableCell>₹{investor.currentValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: investor.profitLoss >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 500
                        }}
                      >
                        ₹{investor.profitLoss.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={investor.status}
                        color={
                          investor.status === 'Active' ? 'success' : 'error'
                        }
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewInvestor(investor)}
                            sx={{ 
                              bgcolor: 'primary.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'primary.dark' },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Investor">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(investor)}
                            sx={{ 
                              bgcolor: 'warning.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'warning.dark' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Email">
                          <IconButton
                            size="small"
                            onClick={() => handleSendEmail(investor)}
                            sx={{ 
                              bgcolor: 'info.main',
                              color: 'white',
                              '&:hover': { bgcolor: 'info.dark' },
                            }}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell padding="checkbox" align="center">
                      <Checkbox
                        checked={selectedInvestors.includes(investor.id)}
                        onChange={() => handleSelectInvestor(investor.id)}
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
  );

  return (
    <AdminLayout>
      {isSuccess ? (
        <>
          {successContent}
          {investorListContent}
        </>
      ) : (
        investorListContent
      )}

      {/* Investor Details Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        {selectedInvestor && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}>
                    {selectedInvestor.initials}
                  </Avatar>
                  <Typography variant="h6">
                    Investor Details - {selectedInvestor.name}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{selectedInvestor.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">{selectedInvestor.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Account Number
                        </Typography>
                        <Typography variant="body1">{selectedInvestor.accountNumber}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip 
                          label={selectedInvestor.status}
                          color={
                            selectedInvestor.status === 'Active' ? 'success' : 'error'
                          }
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Joined Date
                        </Typography>
                        <Typography variant="body1">{selectedInvestor.joinedDate}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Last Transaction
                        </Typography>
                        <Typography variant="body1">{selectedInvestor.lastTransaction}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Balance
                        </Typography>
                        <Typography variant="body1">₹{selectedInvestor.balance.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Invested
                        </Typography>
                        <Typography variant="body1">₹{selectedInvestor.totalInvested.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Current Value
                        </Typography>
                        <Typography variant="body1">₹{selectedInvestor.currentValue.toLocaleString()}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Profit/Loss
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: selectedInvestor.profitLoss >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 500
                          }}
                        >
                          ₹{selectedInvestor.profitLoss.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Investor Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedInvestor && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Edit Investor - {selectedInvestor.name}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={selectedInvestor.name}
                      onChange={(e) => setSelectedInvestor({
                        ...selectedInvestor,
                        name: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={selectedInvestor.email}
                      onChange={(e) => setSelectedInvestor({
                        ...selectedInvestor,
                        email: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={selectedInvestor.phone}
                      onChange={(e) => setSelectedInvestor({
                        ...selectedInvestor,
                        phone: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedInvestor.status}
                        label="Status"
                        onChange={(e) => setSelectedInvestor({
                          ...selectedInvestor,
                          status: e.target.value as 'Active' | 'Inactive'
                        })}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
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
                onClick={() => handleSaveEdit(selectedInvestor)}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setFile(null);
          setStatus('Ready to upload');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Upload Investor Data</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 6,
                width: '100%',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0, 0, 0, 0.01)'
                }
              }}
            >
              <input {...getInputProps()} />
              <IconButton
                sx={{
                  width: 60,
                  height: 60,
                  mb: 2,
                  bgcolor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.main'
                  }
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 30 }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                {isDragActive
                  ? 'Drop the Excel sheet here'
                  : 'Drag and drop Excel sheet here'}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                or
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  const input = document.querySelector('input');
                  if (input) input.click();
                }}
              >
                Browse Files
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                Supported format: .xlsx, .xls (Max 10MB)
              </Typography>
            </Box>

            {/* Status Message */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body1" color="text.secondary">
                Status: {status}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsUploadModalOpen(false);
              setFile(null);
              setStatus('Ready to upload');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!file}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        maxWidth="sm"
        fullWidth
      >
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
              <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50' }} />
            </Box>

            <Typography variant="h5" color="#4caf50" gutterBottom>
              Upload Successful
            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom align="center">
              Your investor data has been validated and stored successfully
            </Typography>

            <Box sx={{ 
              mt: 3, 
              p: 3, 
              bgcolor: '#f8f9fa', 
              borderRadius: 1, 
              width: '100%'
            }}>
              <Typography variant="body1" gutterBottom>
                Filename: {uploadStats.filename}
              </Typography>
              <Typography variant="body1">
                Records processed: {uploadStats.recordsProcessed}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setIsSuccess(false);
              setFile(null);
              setStatus('Ready to upload');
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default InvestorManagement;