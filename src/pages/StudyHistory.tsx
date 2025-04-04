import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import NonVerifiedTALayout from '../components/NonVerifiedTALayout';

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

// Mock data - Replace with actual API calls
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
  // Add more mock studies as needed
];

const StudyHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (study: Study) => {
    setSelectedStudy(study);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudy(null);
  };

  const filteredStudies = mockStudies.filter((study) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      study.stock.toLowerCase().includes(searchLower) ||
      study.exchange.toLowerCase().includes(searchLower) ||
      study.index.toLowerCase().includes(searchLower)
    );
  });

  return (
    <NonVerifiedTALayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Study History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and track all your submitted studies
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder="Search by stock, exchange, or index..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

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
                {filteredStudies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((study) => (
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
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(study)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
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
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </NonVerifiedTALayout>
  );
};

export default StudyHistory; 