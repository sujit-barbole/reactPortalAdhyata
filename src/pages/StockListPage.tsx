import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Search as SearchIcon, Clear as ClearIcon, Filter as FilterIcon } from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

interface Stock {
  id: string;
  stockExchange: string;
  index: string;
  stockName: string;
}

interface Exchange {
  id: string;
  name: string;
}

interface Index {
  id: string;
  exchangeId: string;
  name: string;
}

const StockListPage: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([
    {
      id: '1',
      stockExchange: 'NSE',
      index: 'NIFTY 50',
      stockName: 'RELIANCE'
    },
    {
      id: '2',
      stockExchange: 'NSE',
      index: 'NIFTY 50',
      stockName: 'TCS'
    },
    {
      id: '3',
      stockExchange: 'BSE',
      index: 'SENSEX',
      stockName: 'INFOSYS'
    },
    {
      id: '4',
      stockExchange: 'NSE',
      index: 'NIFTY BANK',
      stockName: 'HDFC BANK'
    }
  ]);

  const [exchanges, setExchanges] = useState<Exchange[]>([
    { id: '1', name: 'NSE' },
    { id: '2', name: 'BSE' }
  ]);

  const [indices, setIndices] = useState<Index[]>([
    { id: '1', exchangeId: '1', name: 'NIFTY 50' },
    { id: '2', exchangeId: '1', name: 'NIFTY BANK' },
    { id: '3', exchangeId: '2', name: 'SENSEX' }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'exchange' | 'index' | 'stock' | null>(null);
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<Partial<Stock & Exchange & Index>>({
    stockExchange: '',
    index: '',
    stockName: '',
    name: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    stockExchange: '',
    index: ''
  });

  const stockExchanges = ['NSE', 'BSE'];
  const indicesForExchanges = {
    'NSE': ['NIFTY 50', 'NIFTY BANK', 'NIFTY IT', 'NIFTY PHARMA'],
    'BSE': ['SENSEX', 'BSE BANKEX', 'BSE IT', 'BSE HEALTHCARE']
  };

  const handleOpenDialog = (type: 'exchange' | 'index' | 'stock', stock?: Stock) => {
    setDialogType(type);
    if (stock) {
      setEditingStock(stock);
      setFormData(stock);
    } else {
      setEditingStock(null);
      setFormData({
        stockExchange: '',
        index: '',
        stockName: '',
        name: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType(null);
    setEditingStock(null);
    setFormData({
      stockExchange: '',
      index: '',
      stockName: '',
      name: ''
    });
  };

  const handleSubmit = () => {
    if (dialogType === 'exchange') {
      const newExchange: Exchange = {
        id: (exchanges.length + 1).toString(),
        name: formData.name || ''
      };
      setExchanges([...exchanges, newExchange]);
    } else if (dialogType === 'index') {
      const newIndex: Index = {
        id: (indices.length + 1).toString(),
        exchangeId: formData.stockExchange || '',
        name: formData.name || ''
      };
      setIndices([...indices, newIndex]);
    } else if (dialogType === 'stock') {
      if (editingStock) {
        setStocks(stocks.map(stock => 
          stock.id === editingStock.id ? { ...stock, ...formData } : stock
        ));
      } else {
        const newStock: Stock = {
          ...formData as Stock,
          id: (stocks.length + 1).toString()
        };
        setStocks([...stocks, newStock]);
      }
    }
    handleCloseDialog();
  };

  const getFilteredStocks = () => {
    let filteredStocks = stocks;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStocks = filteredStocks.filter(stock => 
        stock.stockName.toLowerCase().includes(query) ||
        stock.index.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (filters.stockExchange) {
      filteredStocks = filteredStocks.filter(stock => stock.stockExchange === filters.stockExchange);
    }
    if (filters.index) {
      filteredStocks = filteredStocks.filter(stock => stock.index === filters.index);
    }

    return filteredStocks;
  };

  const getDialogTitle = () => {
    switch (dialogType) {
      case 'exchange':
        return 'Add New Exchange';
      case 'index':
        return 'Add New Index';
      case 'stock':
        return editingStock ? 'Edit Stock' : 'Add New Stock';
      default:
        return '';
    }
  };

  const renderDialogContent = () => {
    switch (dialogType) {
      case 'exchange':
        return (
          <TextField
            fullWidth
            label="Exchange Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
        );
      case 'index':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Stock Exchange</InputLabel>
              <Select
                value={formData.stockExchange}
                label="Stock Exchange"
                onChange={(e) => setFormData({ ...formData, stockExchange: e.target.value })}
              >
                {exchanges.map((exchange) => (
                  <MenuItem key={exchange.id} value={exchange.id}>
                    {exchange.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Index Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
          </>
        );
      case 'stock':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Stock Exchange</InputLabel>
              <Select
                value={formData.stockExchange}
                label="Stock Exchange"
                onChange={(e) => setFormData({ ...formData, stockExchange: e.target.value })}
              >
                {exchanges.map((exchange) => (
                  <MenuItem key={exchange.id} value={exchange.name}>
                    {exchange.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Index</InputLabel>
              <Select
                value={formData.index}
                label="Index"
                onChange={(e) => setFormData({ ...formData, index: e.target.value })}
              >
                {indices
                  .filter(index => index.exchangeId === exchanges.find(e => e.name === formData.stockExchange)?.id)
                  .map((index) => (
                    <MenuItem key={index.id} value={index.name}>
                      {index.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Stock Name"
              value={formData.stockName}
              onChange={(e) => setFormData({ ...formData, stockName: e.target.value })}
              sx={{ mb: 2 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const isFormValid = () => {
    switch (dialogType) {
      case 'exchange':
        return !!formData.name;
      case 'index':
        return !!formData.stockExchange && !!formData.name;
      case 'stock':
        return !!formData.stockExchange && !!formData.index && !!formData.stockName;
      default:
        return false;
    }
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              Stock List
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage stocks and their market information
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Add New Stock Exchange">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('exchange')}
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    color: 'primary.dark'
                  }
                }}
              >
                Add Exchange
              </Button>
            </Tooltip>
            <Tooltip title="Add New Index">
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('index')}
                sx={{ 
                  borderRadius: 2,
                  borderColor: 'success.main',
                  color: 'success.main',
                  '&:hover': {
                    borderColor: 'success.dark',
                    backgroundColor: 'success.light',
                    color: 'success.dark'
                  }
                }}
              >
                Add Index
              </Button>
            </Tooltip>
            <Tooltip title="Add New Stock">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('stock')}
                sx={{ 
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Add Stock
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters and Search */}
        <Box sx={{ mb: 4 }}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              background: 'linear-gradient(to right, #ffffff, #f8f9fa)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: 'text.primary' }}>
                Filters
              </Typography>
              <Button
                startIcon={<ClearIcon />}
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    stockExchange: '',
                    index: ''
                  });
                }}
                size="small"
                color="primary"
                disabled={!searchQuery && !filters.stockExchange && !filters.index}
              >
                Reset All Filters
              </Button>
            </Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by stock name or index..."
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
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Stock Exchange</InputLabel>
                  <Select
                    value={filters.stockExchange}
                    label="Stock Exchange"
                    onChange={(e) => setFilters({ ...filters, stockExchange: e.target.value })}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterIcon color="action" />
                      </InputAdornment>
                    }
                    endAdornment={
                      filters.stockExchange && (
                        <IconButton
                          size="small"
                          onClick={() => setFilters({ ...filters, stockExchange: '' })}
                          sx={{ mr: 2 }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <MenuItem value="">All Exchanges</MenuItem>
                    {exchanges.map((exchange) => (
                      <MenuItem key={exchange.id} value={exchange.name}>
                        {exchange.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Index</InputLabel>
                  <Select
                    value={filters.index}
                    label="Index"
                    onChange={(e) => setFilters({ ...filters, index: e.target.value })}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterIcon color="action" />
                      </InputAdornment>
                    }
                    endAdornment={
                      filters.index && (
                        <IconButton
                          size="small"
                          onClick={() => setFilters({ ...filters, index: '' })}
                          sx={{ mr: 2 }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <MenuItem value="">All Indices</MenuItem>
                    {indices
                      .filter(index => index.exchangeId === exchanges.find(e => e.name === filters.stockExchange)?.id)
                      .map((index) => (
                        <MenuItem key={index.id} value={index.name}>
                          {index.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
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
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>Stock Exchange</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>Index</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '30%' }}>Stock Name</TableCell>
                <TableCell sx={{ fontWeight: 600, width: '20%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredStocks().map((stock) => (
                <TableRow 
                  key={stock.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'grey.50',
                      transition: 'background-color 0.2s'
                    }
                  }}
                >
                  <TableCell>{stock.stockExchange}</TableCell>
                  <TableCell>{stock.index}</TableCell>
                  <TableCell>{stock.stockName}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit Stock">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog('stock', stock)}
                        sx={{ 
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': { 
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.05)',
                            transition: 'transform 0.2s'
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {renderDialogContent()}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={!isFormValid()}
            >
              {editingStock ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default StockListPage; 