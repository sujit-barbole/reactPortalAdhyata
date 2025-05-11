import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  StepLabel, Alert, Snackbar
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  CreditCard as CardIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import { apiService, RegistrationFormData } from '../services/api';

interface FormData {
  aadhaarNumber: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  aadhaarNumber: '',
  name: '',
  email: '',
  username: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
};

const steps = ['Personal Information', 'NSIM Certificate', 'Aadhaar Verification'];

const RegistrationPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const aadhaarFileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAadhaarFile, setSelectedAadhaarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [errors, setErrors] = useState({
    aadhaarNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [activeStep, setActiveStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [hasNsimCertificate, setHasNsimCertificate] = useState<boolean | null>(null);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpTimer, setOtpTimer] = useState(165); // 2 minutes and 45 seconds
  const [userId, setUserId] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [selectedButton, setSelectedButton] = useState<'yes' | 'no' | null>(null);
  const navigate = useNavigate();

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
      // Limit Aadhaar to 12 digits and phone to 10 digits
      if (name === 'aadhaarNumber' && processedValue.length > 12) {
        processedValue = processedValue.slice(0, 12);
      } else if (name === 'phoneNumber' && processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Validate specific fields
    if (name === 'aadhaarNumber') {
      const aadhaarError = validateAadhaarNumber(processedValue);
      setErrors(prev => ({
        ...prev,
        aadhaarNumber: aadhaarError
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

  const handleGetOtp = () => {
    if (formData.aadhaarNumber.length === 12) {
      setOpenOtpDialog(true);
    } else {
      alert('Please enter a valid 12-digit Aadhaar number.');
    }
  };

  const handleCloseOtpDialog = () => {
    setOpenOtpDialog(false);
  };

  const handleOtpSubmit = async () => {
    try {
      if (!otp || otp.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
      }

      const response = await apiService.verifyOtp(Number(userId), otp);

      if (response.status === 'SUCCESS') {
        handleCloseOtpDialog();
        setOpenSuccessDialog(true);
        // Will navigate to login when success dialog is closed
      } else {
        alert(response.error || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert((error as Error).message || 'OTP verification failed. Please try again.');
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    navigate('/login');
  };

  const handleResendOtp = async () => {
    try {
      const response = await apiService.resendOtp(Number(userId));
      if (response.status === 'SUCCESS' && response.data.isOtpSentToUser) {
        setOtpTimer(165); // Reset timer
        alert('OTP has been resent successfully.');
      } else {
        alert('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      alert((error as Error).message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleNext = () => {
    if (activeStep === 2 && !isAadhaarVerified) {
      alert('Please verify Aadhaar before proceeding.');
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRegisterSubmit = async () => {
    try {
      setRegistrationError('');

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

      // Only require NSIM certificate if user selected "Yes"
      if (hasNsimCertificate === true && !selectedFile) {
        setSnackbarMessage('Please upload NSIM certificate');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }

      // Prepare NSIM certificate data if available
      let nsimCertificateData = null;
      if (selectedFile) {
        const reader = new FileReader();
        nsimCertificateData = await new Promise<string | null>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(selectedFile);
        });
      }

      // Create request data object
      const requestData: RegistrationFormData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        aadhaarNumber: formData.aadhaarNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'TRADING_ASSISTANT', // Set the role for registration
        nsimCertificate: nsimCertificateData
      };

      // Call registration API
      const response = await apiService.register(requestData);

      if (response.status === 'SUCCESS' && response.data.isOtpSentToUser) {
        setIsOtpSent(true);
        setUserId(response.data.id.toString());
        setOpenOtpDialog(true);
      } else {
        setRegistrationError('Failed to send OTP. Please try again.');
        setSnackbarMessage(response.error || 'Failed to send OTP. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }

    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = (error as Error).message || 'Registration failed. Please try again.';
      setRegistrationError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Function to format the timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start countdown timer when dialog opens
  React.useEffect(() => {
    if (openOtpDialog) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [openOtpDialog]);

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
        Browse NSIM CERTIFICATE
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
          name="name"
          value={formData.name}
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
          label="Username"
          name="username"
          value={formData.username}
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

  const renderOtpVerification = () => (
    <TextField
      fullWidth
      label="Enter OTP"
      name="otp"
      value={otp}
      onChange={handleOtpChange}
      required
      margin="normal"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon color="primary" />
          </InputAdornment>
        ),
      }}
    />
  );

  const renderNsimCertificateStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h6" gutterBottom align="center">
        Do you have an NSIM certificate?
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant={selectedButton === 'yes' ? 'contained' : 'outlined'}
          onClick={() => {
            setSelectedButton('yes');
            setHasNsimCertificate(true);
          }}
          sx={{
            minWidth: '100px',
            bgcolor: selectedButton === 'yes' ? 'primary.main' : 'transparent',
            color: selectedButton === 'yes' ? 'white' : 'primary.main',
            '&:hover': {
              bgcolor: selectedButton === 'yes' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Yes
        </Button>
        <Button
          variant={selectedButton === 'no' ? 'contained' : 'outlined'}
          onClick={() => {
            setSelectedButton('no');
            setHasNsimCertificate(false);
          }}
          sx={{
            minWidth: '100px',
            bgcolor: selectedButton === 'no' ? 'primary.main' : 'transparent',
            color: selectedButton === 'no' ? 'white' : 'primary.main',
            '&:hover': {
              bgcolor: selectedButton === 'no' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          No
        </Button>
      </Box>
      {hasNsimCertificate && (
        <Box sx={{ mt: 4, width: '100%' }}>
          {renderFileUpload()}
        </Box>
      )}
    </Box>
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
        return renderNsimCertificateStep();
      case 2:
        return (
          <>
            <TextField
              fullWidth
              label="Aadhaar Number"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              required
              margin="normal"
              error={!!errors.aadhaarNumber}
              helperText={errors.aadhaarNumber || 'Enter your 12-digit Aadhaar number'}
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
            {isAadhaarVerified && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Aadhaar Verified Successfully
              </Typography>
            )}
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

  const renderOtpDialog = () => (
    <Dialog
      open={openOtpDialog}
      onClose={handleCloseOtpDialog}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Verify Your Registration
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center' }}>
        {isOtpSent ? (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              An OTP has been sent to your registered mobile number
            </Typography>
            <TextField
              fullWidth
              label="Enter 6-digit OTP"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              required
              margin="normal"
              error={otp.length > 0 && otp.length !== 6}
              helperText={otp.length > 0 && otp.length !== 6 ? 'OTP must be 6 digits' : ''}
              InputProps={{
                inputProps: {
                  maxLength: 6,
                  pattern: '[0-9]*',
                  style: { textAlign: 'center', letterSpacing: '0.5em' }
                }
              }}
            />
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              OTP expires in {formatTime(otpTimer)}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="error">
            {registrationError || 'Failed to send OTP. Please try again.'}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', flexDirection: 'column', pb: 3 }}>
        {isOtpSent ? (
          <>
            <Button
              onClick={handleOtpSubmit}
              variant="contained"
              sx={{ mb: 1, minWidth: 200 }}
            >
              Verify OTP
            </Button>
            <Typography variant="body2">
              Didn't receive the OTP?{' '}
              <Link
                onClick={handleResendOtp}
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Resend OTP
              </Link>
            </Typography>
          </>
        ) : (
          <Button
            onClick={handleRegisterSubmit}
            variant="contained"
            sx={{ minWidth: 200 }}
          >
            Try Again
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderSuccessDialog = () => (
    <Dialog
      open={openSuccessDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 4,
          maxWidth: '480px',
          m: 2
        }
      }}
    >
      <DialogContent sx={{ textAlign: 'center', p: 0 }}>
        <Box
          sx={{
            mb: 3,
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(75, 210, 143, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto'
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 40,
              color: '#4BD28F'
            }}
          />
        </Box>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1A1A1A',
            fontSize: '24px',
            lineHeight: 1.3,
            mb: 1
          }}
        >
          Registration Successful
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666666',
            fontSize: '16px',
            mb: 3,
            lineHeight: 1.5
          }}
        >
          Your information has been submitted for review
        </Typography>
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#FFF9E6',
            py: 2,
            px: 3,
            borderRadius: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            minWidth: '300px'
          }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: '#B98900'
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#B98900',
              fontWeight: 500,
              fontSize: '16px'
            }}
          >
            Status: Pending Admin Approval
          </Typography>
        </Paper>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleCloseSuccessDialog}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              minWidth: 200,
              py: 1.5,
              fontSize: '16px',
              fontWeight: 500,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0'
              }
            }}
          >
            Go to Login
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderSnackbar = () => (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          '& .MuiAlert-icon': {
            fontSize: '1.5rem'
          }
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
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
          from: {
            transform: 'scale(1)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: 0.8,
          },
          to: {
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
              type="button"
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleRegisterSubmit : handleNext}
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
      {renderOtpDialog()}
      {renderSuccessDialog()}
      {renderSnackbar()}
    </Box>
  );
};

export default RegistrationPage; 
