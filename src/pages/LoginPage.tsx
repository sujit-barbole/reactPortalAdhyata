import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordState {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordState>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

  const handleLogin = () => {
    console.log('Login button clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Direct login without async/await
    login(email, password)
      .then(() => {
        console.log('Login successful');
        
        // Manually navigate based on credentials
        if (email === 'admin@gmail.com' && password === 'admin') {
          navigate('/admindashboard');
        } else if (email === 'ta@gmail.com' && password === 'ta') {
          navigate('/tadashboard');
        } else if (email === 'nta@gmail.com' && password === 'nta') {
          navigate('/nonverifiedtadashboard');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setError('Invalid credentials. Please try again.');
      });
  };

  // Forgot Password Handlers
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setActiveStep(0);
    setForgotPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleForgotPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async () => {
    try {
      // API call to send OTP
      console.log('Sending OTP to:', forgotPasswordData.email);
      // If successful:
      setActiveStep(1);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      // API call to verify OTP
      console.log('Verifying OTP:', forgotPasswordData.otp);
      // If successful:
      setActiveStep(2);
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      // API call to reset password
      console.log('Resetting password');
      // If successful:
      handleForgotPasswordClose();
      alert('Password reset successful! Please login with your new password.');
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={forgotPasswordData.email}
              onChange={handleForgotPasswordChange}
              required
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSendOTP}
              disabled={!forgotPasswordData.email}
              sx={{ mt: 2 }}
            >
              Send OTP
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Enter OTP"
              name="otp"
              value={forgotPasswordData.otp}
              onChange={handleForgotPasswordChange}
              required
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={!forgotPasswordData.otp}
              sx={{ mt: 2 }}
            >
              Verify OTP
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={forgotPasswordData.newPassword}
              onChange={handleForgotPasswordChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={forgotPasswordData.confirmPassword}
              onChange={handleForgotPasswordChange}
              required
              margin="normal"
              error={forgotPasswordData.confirmPassword !== '' && 
                     forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword}
              helperText={
                forgotPasswordData.confirmPassword !== '' && 
                forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword
                  ? "Passwords do not match"
                  : ""
              }
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              disabled={
                !forgotPasswordData.newPassword || 
                !forgotPasswordData.confirmPassword ||
                forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword
              }
              sx={{ mt: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

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
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3}
          sx={{ 
            width: '100%',
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 2,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 4,
          }}>
            <AccountCircleIcon 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main',
                mb: 2,
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              align="center"
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              align="center"
              sx={{ mt: 1 }}
            >
              Please login to your account
            </Typography>
          </Box>

          {error && (
            <Typography 
              variant="body2" 
              color="error" 
              align="center"
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleLogin}
            sx={{
              mt: 4,
              mb: 2,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              textTransform: 'none',
              borderRadius: 1,
            }}
          >
            Login
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Don't have an account?{' '}
              <Link 
                href="/register" 
                color="primary" 
                sx={{ 
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Register here
              </Link>
            </Typography>
            <Link 
              component="button"
              onClick={handleForgotPasswordOpen}
              color="primary" 
              sx={{ 
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>
        </Paper>

        {/* Forgot Password Dialog */}
        <Dialog 
          open={forgotPasswordOpen} 
          onClose={handleForgotPasswordClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
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
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reset Password
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                pt: 3, 
                pb: 4,
                '& .MuiStepLabel-label': {
                  fontWeight: 500,
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: 'primary.main',
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: 'success.main',
                }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {renderStepContent()}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleForgotPasswordClose}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                }
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default LoginPage; 