import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  Assignment as StudyIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NonVerifiedTALayout from '../components/NonVerifiedTALayout';

const NonVerifiedTADashboard: React.FC = () => {
  const navigate = useNavigate();

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
              onClick={() => navigate('/study-history')}
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
    </NonVerifiedTALayout>
  );
};

export default NonVerifiedTADashboard; 