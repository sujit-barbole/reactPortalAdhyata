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
}));

const FeatureCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
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
    <Box>
      {/* Header/Navigation */}
      <AppBar position="fixed" color="default" elevation={1}>
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
            Welcome to Our Platform
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The best solution for your needs
          </Typography>
        </Container>
      </HeroSection>

      {/* About Us Section */}
      <Box id="about" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container>
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
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container sx={{ py: 8 }}>
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
          bgcolor: 'grey.100',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container>
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
      <Box sx={{ bgcolor: 'grey.100', py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Adhyata
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your trusted partner in online trading.
                Experience the future of trading today.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Connect With Us
              </Typography>
              <Stack direction="row" spacing={2}>
                <SocialButton aria-label="facebook">
                  <FacebookIcon />
                </SocialButton>
                <SocialButton aria-label="twitter">
                  <TwitterIcon />
                </SocialButton>
                <SocialButton aria-label="linkedin">
                  <LinkedInIcon />
                </SocialButton>
                <SocialButton aria-label="instagram">
                  <InstagramIcon />
                </SocialButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button color="inherit" href="#about">About Us</Button>
                <Button color="inherit" href="#features">Features</Button>
                <Button color="inherit" onClick={handleOpenContact}>Contact Us</Button>
              </Stack>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} Adhyata. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Contact Dialog */}
      <Dialog open={openContact} onClose={handleCloseContact} maxWidth="sm" fullWidth>
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
