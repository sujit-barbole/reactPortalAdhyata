import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Lock as LockIcon,
} from '@mui/icons-material';
import NonVerifiedTALayout from '../components/NonVerifiedTALayout';

interface ProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  education: string;
}

const initialProfileData: ProfileData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '9876543210',
  experience: '5 years in IT sector',
  education: 'B.Tech Computer Science',
};

const NonVerifiedTAProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openSaveConfirmationDialog, setOpenSaveConfirmationDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    saveConfirmationPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    saveConfirmationPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSaveProfile = () => {
    setOpenSaveConfirmationDialog(true);
  };

  const handleConfirmSave = () => {
    if (passwordData.saveConfirmationPassword) {
      setIsEditing(false);
      setOpenSaveConfirmationDialog(false);
      setPasswordData(prev => ({ ...prev, saveConfirmationPassword: '' }));
    } else {
      setPasswordErrors(prev => ({
        ...prev,
        saveConfirmationPassword: 'Please enter your password'
      }));
    }
  };

  const handleChangePassword = () => {
    const newPasswordError = validatePassword(passwordData.newPassword);
    const confirmPasswordError = passwordData.newPassword !== passwordData.confirmPassword 
      ? 'Passwords do not match' 
      : '';

    setPasswordErrors({
      currentPassword: '',
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
      saveConfirmationPassword: ''
    });

    if (!newPasswordError && !confirmPasswordError) {
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        saveConfirmationPassword: ''
      });
    }
  };

  const renderProfileSection = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Profile Information</Typography>
        {!isEditing ? (
          <Button
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            variant="outlined"
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={profileData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={profileData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Experience"
            name="experience"
            value={profileData.experience}
            onChange={handleInputChange}
            disabled={!isEditing}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Education"
            name="education"
            value={profileData.education}
            onChange={handleInputChange}
            disabled={!isEditing}
            margin="normal"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const renderPasswordDialog = () => (
    <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword || 'At least 8 characters with uppercase, lowercase, number, and special character'}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
        <Button onClick={handleChangePassword} variant="contained" color="primary">
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderSaveConfirmationDialog = () => (
    <Dialog 
      open={openSaveConfirmationDialog} 
      onClose={() => setOpenSaveConfirmationDialog(false)} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>Confirm Changes</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Please enter your current password to confirm the changes:
          </Typography>
          <TextField
            fullWidth
            label="Current Password"
            name="saveConfirmationPassword"
            type="password"
            value={passwordData.saveConfirmationPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.saveConfirmationPassword}
            helperText={passwordErrors.saveConfirmationPassword}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenSaveConfirmationDialog(false)}>Cancel</Button>
        <Button onClick={handleConfirmSave} variant="contained" color="primary">
          Confirm & Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <NonVerifiedTALayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 2
              }}
            >
              {profileData.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {profileData.fullName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Non-Verified Technical Associate
              </Typography>
            </Box>
          </Box>

          {renderProfileSection()}

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Security</Typography>
              <Button
                startIcon={<LockIcon />}
                onClick={() => setOpenPasswordDialog(true)}
                variant="outlined"
              >
                Change Password
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Last password change: 30 days ago
            </Typography>
          </Paper>
        </Box>
      </Container>

      {renderPasswordDialog()}
      {renderSaveConfirmationDialog()}
    </NonVerifiedTALayout>
  );
};

export default NonVerifiedTAProfile; 