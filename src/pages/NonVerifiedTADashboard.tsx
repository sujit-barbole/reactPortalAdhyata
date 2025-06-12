import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Assignment as StudyIcon,
  History as HistoryIcon,
  Gavel as AgreementIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NonVerifiedTALayout from '../components/NonVerifiedTALayout';
import { useAuth } from '../context/AuthContext';
import { nonVerifiedTAService, StudyResponse } from '../services/api/nonVerifiedTAService';

// Define Study interface
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

const NonVerifiedTADashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [userStatus, setUserStatus] = useState<string | null>(null);

  // Add new state variables for studies
  const [studies, setStudies] = useState<Study[]>([]);
  const [loadingStudies, setLoadingStudies] = useState(false);
  const [studiesError, setStudiesError] = useState<string | null>(null);
  const [openStudyDialog, setOpenStudyDialog] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [openStudyDetailsDialog, setOpenStudyDetailsDialog] = useState(false);

  // Use userData from AuthContext
  useEffect(() => {
    if (userData) {
      setUserStatus(userData.status);
      // Also store in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  const handleAgreementAccept = async () => {
    if (!userData || !userData.id) {
      console.error('User ID not found. User may not be logged in.');
      return;
    }

    try {
      const response = await nonVerifiedTAService.signAgreement(userData.id);

      if (response.status === 'SUCCESS' && response.data) {
        // Update local state
        setUserStatus('TA_AGREEMENT_INITIATED');

        // Update userData in localStorage
        const updatedUserData = { ...userData, status: 'TA_AGREEMENT_INITIATED' };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        // Redirect to the URL provided in the response
        if (response.data.url) {
          // Open in a new tab or redirect to the agreement URL
          window.open(response.data.url, '_blank');
          // Alternatively, to redirect in the same tab:
          // window.location.href = response.data.url;
        } else {
          console.error('Agreement URL not provided in the response');
        }
      } else {
        console.error('Failed to sign agreement:', response.error);
        // Show error message to user
      }
    } catch (error) {
      console.error('Error signing agreement:', error);
      // Show error message to user
    }
  };

  // Add function to fetch and display studies
  const handleViewStudyHistory = async () => {
    if (!userData || !userData.id) {
      console.error('User ID not found. User may not be logged in.');
      return;
    }

    setLoadingStudies(true);
    setStudiesError(null);

    try {
      const response = await nonVerifiedTAService.getUserStudies(userData.id);

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

  return (
    <NonVerifiedTALayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome to your Technical Analysis Dashboard
          </Typography>
        </Box>

        {/* Agreement Section */}
        {(userStatus === "PENDING_TA_AGREEMENT" || userStatus === "TA_AGREEMENT_INITIATED") && (
          <Box sx={{ mb: 4 }}>
            <Card sx={{ mb: 3, borderLeft: '4px solid #1976d2' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AgreementIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                      Trusted Associate Agreement
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please review and accept the Trusted Associate agreement to continue
                    </Typography>
                  </Box>
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Action Required</AlertTitle>
                  Before you can submit studies, you need to accept the terms and conditions of our Trusted Associate agreement.
                </Alert>
                <Typography variant="body2" paragraph>
                  As a Trusted Associate, you agree to provide accurate and unbiased technical analysis, maintain confidentiality of all information, and adhere to our quality standards.
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 3, pb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<AgreementIcon />}
                  onClick={handleAgreementAccept}
                >
                  Complete Agreement
                </Button>
              </CardActions>
            </Card>
          </Box>
        )}

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
              onClick={() => navigate('/submit-study')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StudyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    Submit New Study
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create and submit a new technical or fundamental analysis
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                startIcon={<StudyIcon />}
                sx={{ mt: 'auto' }}
              >
                Submit New Study
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }
              }}
              onClick={handleViewStudyHistory}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HistoryIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    Study History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and track all your submitted studies
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                sx={{ mt: 'auto' }}
              >
                View History
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
              Your Study History
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
              You haven't submitted any studies yet.
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
    </NonVerifiedTALayout>
  );
};

export default NonVerifiedTADashboard; 
