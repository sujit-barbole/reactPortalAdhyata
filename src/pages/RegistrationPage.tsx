import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FormData {
  nsimNumber: string;
  aadhaarNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

const initialFormData: FormData = {
  nsimNumber: '',
  aadhaarNumber: '',
  fullName: '',
  email: '',
  phoneNumber: ''
};

const RegistrationPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [errors, setErrors] = useState({
    aadhaarNumber: '',
    phoneNumber: ''
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        alert('File size should not exceed 5MB');
      }
    }
  };

  const validateAadhaarNumber = (value: string) => {
    if (value && !/^\d+$/.test(value)) {
      return 'Aadhaar number must contain only digits';
    }
    if (value && value.length !== 12) {
      return 'Aadhaar number must be exactly 12 digits';
    }
    return '';
  };

  const validatePhoneNumber = (value: string) => {
    if (value && !/^\d+$/.test(value)) {
      return 'Phone number must contain only digits';
    }
    if (value && value.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Remove any non-digit characters for phone and aadhaar
    let processedValue = value;
    if (name === 'phoneNumber' || name === 'aadhaarNumber') {
      processedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate specific fields
    if (name === 'aadhaarNumber') {
      setErrors(prev => ({
        ...prev,
        aadhaarNumber: validateAadhaarNumber(processedValue)
      }));
    } else if (name === 'phoneNumber') {
      setErrors(prev => ({
        ...prev,
        phoneNumber: validatePhoneNumber(processedValue)
      }));
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate all fields before submission
      const aadhaarError = validateAadhaarNumber(formData.aadhaarNumber);
      const phoneError = validatePhoneNumber(formData.phoneNumber);

      setErrors({
        aadhaarNumber: aadhaarError,
        phoneNumber: phoneError
      });

      if (aadhaarError || phoneError) {
        return;
      }

      if (!selectedFile) {
        alert('Please upload a certificate');
        return;
      }

      // Here you would typically send the data to your backend
      console.log('Form Data:', formData);
      console.log('Selected File:', selectedFile);
      
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleOpenTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenTerms(true);
  };

  const handleCloseTerms = () => {
    setOpenTerms(false);
  };

  const handleOpenPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpenPrivacy(true);
  };

  const handleClosePrivacy = () => {
    setOpenPrivacy(false);
  };

  const renderFileUpload = () => (
    <FormControl fullWidth margin="normal">
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 1,
          p: { xs: 2, sm: 3 },
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />
        <CloudUploadIcon 
          sx={{ 
            fontSize: { xs: 32, sm: 40 }, 
            color: 'text.secondary',
            mb: 1
          }} 
        />
        <Typography variant="body1">
          {selectedFile ? selectedFile.name : 'Drag and drop certificate here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PDF, JPG or PNG (Max 5MB)
        </Typography>
      </Box>
      <Button 
        variant="text" 
        onClick={() => fileInputRef.current?.click()}
        sx={{ mt: 1 }}
      >
        Browse Files
      </Button>
    </FormControl>
  );

  const renderPersonalInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          margin="normal"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          margin="normal"
        />
      </Grid>
    </Grid>
  );

  const renderContactInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
          margin="normal"
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber || 'Enter 10 digit mobile number'}
          InputProps={{
            inputProps: {
              maxLength: 10,
              pattern: '[0-9]*'
            }
          }}
        />
      </Grid>
    </Grid>
  );

  const renderTermsDialog = () => (
    <Dialog 
      open={openTerms} 
      onClose={handleCloseTerms}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        Terms of Service
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Acceptance of Terms
        </Typography>
        <Typography paragraph>
          By accessing and using this platform, you agree to be bound by these Terms of Service.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. User Responsibilities
        </Typography>
        <Typography paragraph>
          Users must provide accurate information during registration and maintain the confidentiality of their account.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Service Usage
        </Typography>
        <Typography paragraph>
          The platform is to be used for legitimate business purposes only. Any misuse will result in immediate termination.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Data Security
        </Typography>
        <Typography paragraph>
          We implement industry-standard security measures to protect your data. Users are responsible for maintaining their account security.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Modifications
        </Typography>
        <Typography paragraph>
          We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCloseTerms} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPrivacyDialog = () => (
    <Dialog 
      open={openPrivacy} 
      onClose={handleClosePrivacy}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        Privacy Policy
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Information Collection
        </Typography>
        <Typography paragraph>
          We collect personal information necessary for registration and verification purposes, including but not limited to name, email, phone number, and identification documents.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. Data Usage
        </Typography>
        <Typography paragraph>
          Your information is used solely for verification, communication, and service improvement purposes. We do not sell or share your data with third parties.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Data Protection
        </Typography>
        <Typography paragraph>
          We employ industry-standard encryption and security measures to protect your personal information from unauthorized access or disclosure.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. User Rights
        </Typography>
        <Typography paragraph>
          You have the right to access, modify, or delete your personal information. Contact our support team for assistance with data-related requests.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Cookies and Tracking
        </Typography>
        <Typography paragraph>
          We use cookies and similar technologies to enhance user experience and analyze platform usage patterns.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClosePrivacy} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, sm: 6, md: 8 },
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Box 
          component="form" 
          onSubmit={handleRegisterSubmit}
          sx={{ 
            width: '100%',
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
            }}
          >
            Register as Trusted Associate
          </Typography>

          <TextField
            fullWidth
            label="NSIM Number"
            name="nsimNumber"
            value={formData.nsimNumber}
            onChange={handleInputChange}
            required
            margin="normal"
          />

          {renderFileUpload()}

          <TextField
            fullWidth
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleInputChange}
            required
            margin="normal"
            error={!!errors.aadhaarNumber}
            helperText={errors.aadhaarNumber || 'Your Aadhaar number will be verified via OTP'}
            InputProps={{
              inputProps: {
                maxLength: 12,
                pattern: '[0-9]*'
              }
            }}
          />

          {renderPersonalInfo()}
          {renderContactInfo()}

          <Button 
            type="submit"
            variant="contained" 
            fullWidth 
            size="large"
            sx={{
              mt: 4,
              mb: 2,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: 2
            }}
          >
            Register
          </Button>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              mb: 2
            }}
          >
            Already have an account?{' '}
            <Link 
              href="/login" 
              color="primary" 
              sx={{ 
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
                LogIn here
            </Link>
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            By registering, you agree to our{' '}
            <Link 
              href="#" 
              color="primary" 
              sx={{ textDecoration: 'none' }}
              onClick={handleOpenTerms}
            >
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link 
              href="#" 
              color="primary" 
              sx={{ textDecoration: 'none' }}
              onClick={handleOpenPrivacy}
            >
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Container>

      {renderTermsDialog()}
      {renderPrivacyDialog()}
    </Box>
  );
};

export default RegistrationPage; 