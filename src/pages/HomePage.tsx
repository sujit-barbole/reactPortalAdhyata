import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Theme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  FormHelperText,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';

// Import images
import heroImage from '../assets/images/hero-bg.svg';
import tradingImage from '../assets/images/trading-platform.svg';
import modernDesignImage from '../assets/images/modern-design.svg';
import fastPerformanceImage from '../assets/images/fast-performance.svg';
import integrationImage from '../assets/images/integration.svg';

// Styled components
const HeroSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  marginTop: '64px', // Height of AppBar
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.2), transparent 50%)',
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
}));

const FeatureCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openContact, setOpenContact] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nsimNumber: '',
    aadhaarNumber: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    organization: ''
  });

  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);
  const handleOpenLogin = () => {
    navigate('/login');  // Replace dialog with navigation
  };
  const handleOpenRegister = () => navigate('/register');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setSelectedFile(file);
      } else {
        alert('File size should not exceed 5MB');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Selected File:', selectedFile);
  };

  const features = [
    {
      title: 'Modern Design',
      description: 'Beautiful and responsive design that works on all devices',
      image: modernDesignImage,
    },
    {
      title: 'Fast Performance',
      description: 'Optimized for speed and smooth user experience',
      image: fastPerformanceImage,
    },
    {
      title: 'Easy Integration',
      description: 'Seamlessly integrate with your existing systems',
      image: integrationImage,
    },
  ];

  return (
    <Box sx={{ 
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
    }}>
      {/* Header/Navigation */}
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={1}
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            Adhyata
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" href="#about">About</Button>
            <Button color="inherit" href="#features">Features</Button>
            <Button color="inherit" onClick={handleOpenContact}>Contact Us</Button>
            <Button variant="outlined" color="primary" onClick={handleOpenLogin}>
              Login
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenRegister}>
              Register
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Adhyata
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The best solution for your needs
          </Typography>
        </Container>
      </HeroSection>

      {/* About Us Section */}
      <Box 
        id="about" 
        sx={{ 
          py: 8, 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at bottom left, rgba(25, 118, 210, 0.05), transparent 50%)',
            zIndex: 0,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            About Us
          </Typography>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom color="primary">
                Your Trusted Trading Partner
              </Typography>
              <Typography paragraph>
                Adhyata has been at the forefront of online trading since 2010. 
                We provide cutting-edge trading solutions that empower investors to make 
                informed decisions and achieve their financial goals.
              </Typography>
              <Typography paragraph>
                Our platform combines advanced technology with user-friendly interfaces, 
                making it accessible for both novice and experienced traders.
              </Typography>
              <List>
                <ListItem>
                  <Typography variant="body1">✓ 10+ Years of Excellence</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body1">✓ 1M+ Active Traders</Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="body1">✓ 24/7 Expert Support</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={tradingImage}
                alt="About Us"
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        id="features" 
        sx={{ 
          py: 8, 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(25, 118, 210, 0.05), transparent 50%)',
            zIndex: 0,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Our Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      objectFit: 'contain',
                      p: 2,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h3">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(100, 181, 246, 0.1) 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, rgba(25, 118, 210, 0.1), transparent 70%)',
            zIndex: 0,
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Join thousands of satisfied customers who have transformed their business with our platform.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={handleOpenContact}
          >
            Contact Us
          </Button>
        </Container>
      </Box>

      {/* Footer with Social Media */}
      <Box 
        sx={{ 
          py: 4,
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  Adhyata
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your trusted partner in online trading
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <SocialButton size="small" aria-label="facebook">
                  <FacebookIcon fontSize="small" />
                </SocialButton>
                <SocialButton size="small" aria-label="twitter">
                  <TwitterIcon fontSize="small" />
                </SocialButton>
                <SocialButton size="small" aria-label="linkedin">
                  <LinkedInIcon fontSize="small" />
                </SocialButton>
                <SocialButton size="small" aria-label="instagram">
                  <InstagramIcon fontSize="small" />
                </SocialButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  color="primary" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  Quick Links
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button 
                    color="inherit" 
                    href="#about" 
                    size="small"
                    sx={{ 
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    About Us
                  </Button>
                  <Button 
                    color="inherit" 
                    href="#features" 
                    size="small"
                    sx={{ 
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    Features
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={handleOpenContact} 
                    size="small"
                    sx={{ 
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    Contact
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ 
              mt: 3,
              fontSize: '0.75rem',
              opacity: 0.8
            }}
          >
            © {new Date().getFullYear()} Adhyata. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog 
        open={openContact} 
        onClose={handleCloseContact} 
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
        <DialogTitle sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          Contact Information
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Email"
                secondary="support@Adhyata.com"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Phone"
                secondary="+1 (555) 123-4567"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOnIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Address"
                secondary="123 Trading Street, Financial District, New York, NY 10004"
              />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Our support team is available 24/7 to assist you
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseContact} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
