import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Link,
  FormControl,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would typically handle login logic
      console.log('Login Data:', formData);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
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
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Box 
          component="form" 
          onSubmit={handleLoginSubmit}
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
            Login to Your Account
          </Typography>

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

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            margin="normal"
          />

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
            Login
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

          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            <Link 
              href="#" 
              color="primary" 
              sx={{ textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 