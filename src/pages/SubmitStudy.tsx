import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  InputAdornment,
  Snackbar,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import NonVerifiedTALayout from '../components/NonVerifiedTALayout';
import { nonVerifiedTAService } from '../services/api/nonVerifiedTAService';
import { useAuth } from '../context/AuthContext';

type ExchangeId = 1 | 2 | 3;

// Mock data - Replace with actual API calls
const exchanges = [
  { id: 1 as ExchangeId, name: 'NSE' },
  { id: 2 as ExchangeId, name: 'BSE' },
  { id: 3 as ExchangeId, name: 'MCX' },
];

const indices = {
  1: [ // NSE indices
    { id: 1, name: 'NIFTY 50' },
    { id: 2, name: 'NIFTY BANK' },
    { id: 3, name: 'NIFTY IT' },
  ],
  2: [ // BSE indices
    { id: 4, name: 'SENSEX' },
    { id: 5, name: 'BSE BANKEX' },
    { id: 6, name: 'BSE IT' },
  ],
  3: [ // MCX indices
    { id: 7, name: 'MCX METAL' },
    { id: 8, name: 'MCX ENERGY' },
    { id: 9, name: 'MCX AGRICULTURE' },
  ],
};

const stocks = {
  1: [ // NSE stocks
    { id: 1, name: 'RELIANCE', price: 2456.75 },
    { id: 2, name: 'TCS', price: 3456.80 },
    { id: 3, name: 'HDFCBANK', price: 1567.90 },
  ],
  2: [ // BSE stocks
    { id: 4, name: 'INFOSYS', price: 1456.75 },
    { id: 5, name: 'ICICIBANK', price: 956.80 },
    { id: 6, name: 'HINDUNILVR', price: 2567.90 },
  ],
  3: [ // MCX stocks
    { id: 7, name: 'GOLD', price: 54567.75 },
    { id: 8, name: 'SILVER', price: 74567.80 },
    { id: 9, name: 'CRUDE OIL', price: 6567.90 },
  ],
};

const SubmitStudy: React.FC = () => {
  const [exchange, setExchange] = useState<ExchangeId | ''>('');
  const [index, setIndex] = useState('');
  const [stock, setStock] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [action, setAction] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [studyText, setStudyText] = useState('');
  const [exchangeSearch, setExchangeSearch] = useState('');
  const [indexSearch, setIndexSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const { userData } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleExchangeChange = (event: any) => {
    setExchange(event.target.value as ExchangeId);
    setIndex('');
    setStock('');
  };

  const handleIndexChange = (event: any) => {
    console.log('Setting index to:', event.target.value);
    setIndex(event.target.value);
    setStock('');
  };

  const handleStockChange = (event: any) => {
    console.log('Setting stock to:', event.target.value);
    setStock(event.target.value);
  };

  const filteredExchanges = exchanges.filter(ex =>
    ex.name.toLowerCase().includes(exchangeSearch.toLowerCase())
  );

  const filteredIndices = indices[exchange as ExchangeId]?.filter(idx =>
    idx.name.toLowerCase().includes(indexSearch.toLowerCase())
  ) || [];

  const filteredStocks = stocks[exchange as ExchangeId]?.filter(stk =>
    stk.name.toLowerCase().includes(stockSearch.toLowerCase())
  ) || [];

  const handleReset = () => {
    setExchange('');
    setIndex('');
    setStock('');
    setCurrentPrice('');
    setAction('');
    setExpectedPrice('');
    setStudyText('');
    setExchangeSearch('');
    setIndexSearch('');
    setStockSearch('');
  };

  const handleSubmitStudy = async () => {
    if (!userData || !userData.id) {
      setSnackbarMessage('User ID not found. You may not be logged in.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Find the exchange name based on the selected exchange ID
      const selectedExchangeName = exchange ? exchanges.find(ex => ex.id === exchange)?.name || '' : '';

      // For index and stock, we need to convert the string ID back to a number for comparison
      // or ensure we're comparing strings to strings

      // For index
      const selectedIndexObj = index && exchange ?
        indices[exchange as ExchangeId].find(idx => idx.id.toString() === index.toString()) : null;
      const selectedIndexName = selectedIndexObj ? selectedIndexObj.name : '';

      // For stock
      const selectedStockObj = stock && exchange ?
        stocks[exchange as ExchangeId].find(stk => stk.id.toString() === stock.toString()) : null;
      const selectedStockName = selectedStockObj ? selectedStockObj.name : '';

      console.log('Selected objects:', {
        indexObj: selectedIndexObj,
        stockObj: selectedStockObj
      });

      const studyData = {
        userId: userData.id,
        stockExchange: selectedExchangeName,
        stockName: selectedStockName,
        stockIndex: selectedIndexName,
        currentPrice: parseFloat(currentPrice),
        expectedPrice: parseFloat(expectedPrice),
        action: action,
        analysis: studyText
      };

      console.log('Study data being sent:', studyData);

      const response = await nonVerifiedTAService.submitStudy(studyData);

      if (response.status === 'SUCCESS' && response.data) {
        // Show success message
        setSnackbarMessage('Study submitted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleReset(); // Clear the form
      } else {
        // Extract the actual error message from the response
        const errorMsg = response.error || 'Unknown error';
        // Clean up duplicated error prefixes if present
        const cleanErrorMsg = errorMsg.replace(/Failed to submit study: /g, '');

        console.error('Failed to submit study:', cleanErrorMsg);
        setSnackbarMessage(cleanErrorMsg);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error: any) {
      console.error('Error submitting study:', error);
      setSnackbarMessage(error.message || 'Error submitting study. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <NonVerifiedTALayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Submit New Study
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create and submit your technical or fundamental analysis
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Exchange Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Stock Exchange</InputLabel>
                <Select
                  value={exchange}
                  onChange={handleExchangeChange}
                  label="Stock Exchange"
                  input={<OutlinedInput label="Stock Exchange" />}
                  onClose={() => setExchangeSearch('')}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Search exchange..."
                      value={exchangeSearch}
                      onChange={(e) => setExchangeSearch(e.target.value)}
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {filteredExchanges.map((ex) => (
                    <MenuItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Index Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!exchange}>
                <InputLabel>Index</InputLabel>
                <Select
                  value={index}
                  onChange={handleIndexChange}
                  label="Index"
                  input={<OutlinedInput label="Index" />}
                  onClose={() => setIndexSearch('')}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Search index..."
                      value={indexSearch}
                      onChange={(e) => setIndexSearch(e.target.value)}
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {filteredIndices.map((idx) => (
                    <MenuItem key={idx.id} value={idx.id}>
                      {idx.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Stock Selection */}
            <Grid item xs={12} md={4}>
              <FormControl fullWidth disabled={!index}>
                <InputLabel>Stock</InputLabel>
                <Select
                  value={stock}
                  onChange={handleStockChange}
                  label="Stock"
                  input={<OutlinedInput label="Stock" />}
                  onClose={() => setStockSearch('')}
                >
                  <Box sx={{ p: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Search stock..."
                      value={stockSearch}
                      onChange={(e) => setStockSearch(e.target.value)}
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {filteredStocks.map((stk) => (
                    <MenuItem key={stk.id} value={stk.id}>
                      {stk.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Study Details */}
            {stock && (
              <>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Current Price"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Action</InputLabel>
                    <Select
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      label="Action"
                    >
                      <MenuItem value="BUY">BUY</MenuItem>
                      <MenuItem value="SELL">SELL</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Expected Price"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Study Analysis"
                    value={studyText}
                    onChange={(e) => setStudyText(e.target.value)}
                    placeholder="Enter your detailed analysis here..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" color="inherit" onClick={handleReset}>
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!studyText || !action || !expectedPrice || !currentPrice}
                      onClick={handleSubmitStudy}
                    >
                      Submit Study
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          <AlertTitle>{snackbarSeverity === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </NonVerifiedTALayout>
  );
};

export default SubmitStudy; 
