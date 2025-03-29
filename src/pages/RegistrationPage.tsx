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
  Paper,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  CreditCard as CardIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

interface FormData {
  nsimNumber: string;
  aadhaarNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  education: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  nsimNumber: '',
  aadhaarNumber: '',
  fullName: '',
  email: '',
  phoneNumber: '',
  experience: '',
  education: '',
  password: '',
  confirmPassword: ''
};

const steps = ['Personal Information', 'Educational Information', 'Document Upload'];

const RegistrationPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const aadhaarFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAadhaarFile, setSelectedAadhaarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [errors, setErrors] = useState({
    aadhaarNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [activeStep, setActiveStep] = useState(0);

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

  const handleAadhaarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedAadhaarFile(file);
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

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
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

    // Add password validation
    if (name === 'password') {
      const passwordError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError,
        confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value)
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }

    try {
      // Validate all fields before submission
      const aadhaarError = validateAadhaarNumber(formData.aadhaarNumber);
      const phoneError = validatePhoneNumber(formData.phoneNumber);
      const passwordError = validatePassword(formData.password);
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

      setErrors({
        aadhaarNumber: aadhaarError,
        phoneNumber: phoneError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });

      if (aadhaarError || phoneError || passwordError || confirmPasswordError) {
        return;
      }

      if (!selectedFile || !selectedAadhaarFile) {
        alert('Please upload all required documents');
        return;
      }

      // Here you would typically send the data to your backend
      console.log('Form Data:', formData);
      console.log('Selected Files:', { certificate: selectedFile, aadhaar: selectedAadhaarFile });
      
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

  const renderAadhaarUpload = () => (
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
        onClick={() => aadhaarFileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={aadhaarFileInputRef}
          hidden
          accept="image/*,.pdf"
          onChange={handleAadhaarFileChange}
        />
        <CloudUploadIcon 
          sx={{ 
            fontSize: { xs: 32, sm: 40 }, 
            color: 'text.secondary',
            mb: 1
          }} 
        />
        <Typography variant="body1">
          {selectedAadhaarFile ? selectedAadhaarFile.name : 'Upload Aadhaar Card'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PDF, JPG or PNG (Max 5MB)
        </Typography>
      </Box>
      <Button 
        variant="text" 
        onClick={() => aadhaarFileInputRef.current?.click()}
        sx={{ mt: 1 }}
      >
        Browse Aadhaar Card
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
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
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="primary" />
              </InputAdornment>
            ),
            inputProps: {
              maxLength: 10,
              pattern: '[0-9]*'
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const renderPasswordFields = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          margin="normal"
          error={!!errors.password}
          helperText={errors.password || 'At least 8 characters with uppercase, lowercase, number, and special character'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          margin="normal"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const renderEducationAndExperience = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Education Qualification"
          name="education"
          value={formData.education}
          onChange={handleInputChange}
          required
          margin="normal"
          placeholder="e.g., B.Tech Computer Science"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SchoolIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Years of Experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          required
          margin="normal"
          placeholder="e.g., 5 years in IT sector"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            {renderPersonalInfo()}
            {renderPasswordFields()}
          </>
        );
      case 1:
        return (
          <>
            {renderEducationAndExperience()}
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
                startAdornment: (
                  <InputAdornment position="start">
                    <CardIcon color="primary" />
                  </InputAdornment>
                ),
                inputProps: {
                  maxLength: 12,
                  pattern: '[0-9]*'
                }
              }}
            />
            <TextField
              fullWidth
              label="NSIM Number"
              name="nsimNumber"
              value={formData.nsimNumber}
              onChange={handleInputChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 2:
        return (
          <>
            {renderAadhaarUpload()}
            {renderFileUpload()}
          </>
        );
      default:
        return null;
    }
  };

  const renderTermsDialog = () => (
    <Dialog 
      open={openTerms} 
      onClose={handleCloseTerms}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Terms of Service
        </Typography>
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
        <Button 
          onClick={handleCloseTerms}
          variant="contained"
          sx={{ 
            textTransform: 'none',
            borderRadius: 1,
          }}
        >
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
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Privacy Policy
        </Typography>
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
        <Button 
          onClick={handleClosePrivacy}
          variant="contained"
          sx={{ 
            textTransform: 'none',
            borderRadius: 1,
          }}
        >
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
        bgcolor: 'background.default',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.1), transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: 0.8,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0.5,
          },
        },
      }}
    >
      <Container maxWidth="md">
        <Paper 
          component="form" 
          onSubmit={handleRegisterSubmit}
          elevation={3}
          sx={{ 
            width: '100%',
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)',
              transform: 'translate(50%, -50%)',
              borderRadius: '50%',
              animation: 'float 6s ease-in-out infinite',
            },
            '@keyframes float': {
              '0%': {
                transform: 'translate(50%, -50%) scale(1)',
              },
              '50%': {
                transform: 'translate(50%, -50%) scale(1.2)',
              },
              '100%': {
                transform: 'translate(50%, -50%) scale(1)',
              },
            },
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 4,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: -1,
            }
          }}>
            <PersonIcon 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main',
                mb: 2,
                animation: 'bounce 2s ease-in-out infinite',
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              align="center"
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Register as Trusted Associate
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              align="center"
              sx={{ mt: 1 }}
            >
              Please fill in your details to create an account
            </Typography>
          </Box>

          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-label': {
                color: 'text.secondary',
                '&.Mui-active': {
                  color: 'primary.main',
                },
                '&.Mui-completed': {
                  color: 'primary.main',
                },
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              {activeStep === steps.length - 1 ? 'Register' : 'Next'}
            </Button>
          </Box>

          {activeStep === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
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
                  Login here
                </Link>
              </Typography>
            </Box>
          )}

          {activeStep === steps.length - 1 && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ mt: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              By registering, you agree to our{' '}
              <Link 
                href="#" 
                color="primary" 
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={handleOpenTerms}
              >
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link 
                href="#" 
                color="primary" 
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={handleOpenPrivacy}
              >
                Privacy Policy
              </Link>
            </Typography>
          )}
        </Paper>
      </Container>

      {renderTermsDialog()}
      {renderPrivacyDialog()}
    </Box>
  );
};

export default RegistrationPage; 