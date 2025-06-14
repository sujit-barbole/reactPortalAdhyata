import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    Paper,
    Button,
    Alert,
} from '@mui/material';
import { CheckCircle as SuccessIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { apiClient, ApiResponse, handleApiError } from '../services/api/apiConfig';

const ESignCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userData, refreshUserData } = useAuth();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Extract token from URL query parameters
                const queryParams = new URLSearchParams(location.search);
                const token = queryParams.get('token');

                if (!token) {
                    setError('Invalid callback: Missing token');
                    setLoading(false);
                    return;
                }

                // Use apiClient instead of fetch
                const response = await apiClient.get<ApiResponse<any>>(`/esign/callback`, {
                    params: { token }
                });

                if (response.data.status === 'SUCCESS') {
                    setSuccess(true);
                    // Refresh user data to get updated status
                    if (refreshUserData) {
                        await refreshUserData();
                    }
                } else {
                    setError(response.data.error || 'Failed to process e-sign callback');
                }
            } catch (err: any) {
                console.error('Error processing e-sign callback:', err);
                const errorResponse = handleApiError(err, 'An unexpected error occurred while processing your agreement');
                setError(errorResponse.error || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        processCallback();
    }, [location.search, refreshUserData]);

    const handleContinue = () => {
        navigate('/nonverifiedtadashboard');
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <CircularProgress size={60} sx={{ mb: 3 }} />
                        <Typography variant="h6">Processing your agreement...</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Please wait while we verify your e-signature
                        </Typography>
                    </Box>
                ) : success ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                        <SuccessIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Agreement Completed Successfully!
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                            Your agreement has been successfully signed and processed. You can now continue using the platform.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleContinue}
                            sx={{ minWidth: 200 }}
                        >
                            Continue to Dashboard
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                        <ErrorIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
                        <Typography variant="h5" gutterBottom>
                            Agreement Processing Failed
                        </Typography>
                        <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
                            {error || 'Failed to process your agreement. Please try again.'}
                        </Alert>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleContinue}
                            sx={{ minWidth: 200 }}
                        >
                            Return to Dashboard
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ESignCallbackPage;
