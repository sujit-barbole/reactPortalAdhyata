import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const InvestorManagement: React.FC = () => {
  const [status, setStatus] = useState('Ready to upload');
  const [file, setFile] = useState<File | null>(null);

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
        
        setStatus('Upload completed successfully!');
        setFile(null); // Reset the file after successful upload
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
      }
    }
  };

  return (
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

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, width: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Status: {status}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default InvestorManagement; 