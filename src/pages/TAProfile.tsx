import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Save as SaveIcon, 
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import TALayout from '../components/TALayout';

interface ProfileData {
  nsimNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  experience: string;
  education: string;
  aadhaarNumber: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

const initialProfileData: ProfileData = {
  nsimNumber: 'NSIM123456',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '9876543210',
  experience: '5 years in IT sector',
  education: 'B.Tech Computer Science',
  aadhaarNumber: '123456789012'
};

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'NSIM Certificate.pdf',
    type: 'NSIM Certificate',
    uploadDate: '2024-03-15',
    status: 'Verified'
  },
  {
    id: '2',
    name: 'Aadhaar Card.pdf',
    type: 'Aadhaar Card',
    uploadDate: '2024-03-15',
    status: 'Verified'
  }
];

const TAProfile: React.FC = () => {
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
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Here you would typically verify the password with your backend
    // For demo purposes, we'll just check if it's not empty
    if (passwordData.saveConfirmationPassword) {
      // Here you would typically make an API call to update the profile
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
    // Validate passwords
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
      // Here you would typically make an API call to update the password
      setOpenPasswordDialog(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        saveConfirmationPassword: ''
      });
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        // Here you would typically upload the file to your backend
        // For demo purposes, we'll just update the local state
        const newDocument: Document = {
          id: Date.now().toString(),
          name: file.name,
          type: selectedDocument?.type || '',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Pending'
        };
        setDocuments(prev => [...prev, newDocument]);
        setOpenDocumentDialog(false);
      } else {
        alert('File size should not exceed 5MB');
      }
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Verified':
        return '#2e7d32';
      case 'Pending':
        return '#ed6c02';
      case 'Rejected':
        return '#d32f2f';
      default:
        return '#757575';
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
            label="NSIM Number"
            name="nsimNumber"
            value={profileData.nsimNumber}
            disabled
            margin="normal"
          />
        </Grid>
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
            label="Education"
            name="education"
            value={profileData.education}
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
      </Grid>
    </Paper>
  );

  const renderDocumentsSection = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Documents</Typography>
      </Box>

      <List>
        {documents.map((doc) => (
          <ListItem 
            key={doc.id}
            sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon color="action" />
                  <Typography variant="subtitle1">{doc.name}</Typography>
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded on: {new Date(doc.uploadDate).toLocaleDateString()}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getStatusColor(doc.status),
                      fontWeight: 500
                    }}
                  >
                    {doc.status}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => {
                  setSelectedDocument(doc);
                  setOpenDocumentDialog(true);
                }}
                sx={{ mr: 1 }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton 
                edge="end" 
                onClick={() => {
                  setSelectedDocument(doc);
                  fileInputRef.current?.click();
                }}
              >
                <CloudUploadIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*,.pdf"
        onChange={handleDocumentUpload}
      />
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

  const renderDocumentDialog = () => (
    <Dialog open={openDocumentDialog} onClose={() => setOpenDocumentDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Please select a document to upload:
          </Typography>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*,.pdf"
            onChange={handleDocumentUpload}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDocumentDialog(false)}>Cancel</Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="contained" color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <TALayout>
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
                Trusted Associate
              </Typography>
            </Box>
          </Box>

          {renderProfileSection()}
          {renderDocumentsSection()}

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
      {renderDocumentDialog()}
    </TALayout>
  );
};

export default TAProfile; 