import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

interface Bucket {
  id: string;
  name: string;
  successRate: number;
  minDeposit: number;
  maxCalls: number | string;
}

const BucketManagementPage: React.FC = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([
    {
      id: '1',
      name: 'Basic Bucket',
      successRate: 50,
      minDeposit: 0,
      maxCalls: 3
    },
    {
      id: '2',
      name: 'Gold Bucket',
      successRate: 65,
      minDeposit: 10000,
      maxCalls: 5
    },
    {
      id: '3',
      name: 'Platinum Bucket',
      successRate: 75,
      minDeposit: 20000,
      maxCalls: 10
    },
    {
      id: '4',
      name: 'Diamond Bucket',
      successRate: 85,
      minDeposit: 50000,
      maxCalls: 'Unlimited'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBucket, setEditingBucket] = useState<Bucket | null>(null);
  const [formData, setFormData] = useState<Partial<Bucket>>({
    name: '',
    successRate: 0,
    minDeposit: 0,
    maxCalls: 0
  });

  const handleOpenDialog = (bucket?: Bucket) => {
    if (bucket) {
      setEditingBucket(bucket);
      setFormData(bucket);
    } else {
      setEditingBucket(null);
      setFormData({
        name: '',
        successRate: 0,
        minDeposit: 0,
        maxCalls: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBucket(null);
    setFormData({
      name: '',
      successRate: 0,
      minDeposit: 0,
      maxCalls: 0
    });
  };

  const handleSubmit = () => {
    if (editingBucket) {
      // Update existing bucket
      setBuckets(buckets.map(bucket => 
        bucket.id === editingBucket.id ? { ...bucket, ...formData } : bucket
      ));
    } else {
      // Add new bucket
      const newBucket: Bucket = {
        ...formData as Bucket,
        id: (buckets.length + 1).toString()
      };
      setBuckets([...buckets, newBucket]);
    }
    handleCloseDialog();
  };

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              Bucket Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage trading buckets and their requirements
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Add New Bucket
          </Button>
        </Box>

        <Grid container spacing={3}>
          {buckets.map((bucket) => (
            <Grid item xs={12} md={6} lg={3} key={bucket.id}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.main',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1
                }}>
                  <Tooltip title="Edit Bucket">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(bucket)}
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
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Bucket Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editingBucket ? 'Edit Bucket' : 'Add New Bucket'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Bucket Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Success Rate (%)"
                type="number"
                value={formData.successRate}
                onChange={(e) => setFormData({ ...formData, successRate: Number(e.target.value) })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Minimum Deposit"
                type="number"
                value={formData.minDeposit}
                onChange={(e) => setFormData({ ...formData, minDeposit: Number(e.target.value) })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Maximum Calls"
                value={formData.maxCalls}
                onChange={(e) => setFormData({ ...formData, maxCalls: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.successRate || !formData.minDeposit || !formData.maxCalls}
            >
              {editingBucket ? 'Update' : 'Add'} Bucket
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default BucketManagementPage; 