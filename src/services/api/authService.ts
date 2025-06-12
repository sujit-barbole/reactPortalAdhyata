import { apiClient, API_BASE_URL, ApiResponse, handleApiError } from './apiConfig';
import axios from 'axios';

// Auth-related interfaces
export interface RegistrationFormData {
  nsimCertificate?: string | null;
  aadhaarNumber: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface RegistrationData {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phoneNumber: string;
  aadhaarNumber: string;
  nsimDocumentKey: string;
  isOtpSentToUser: boolean;
}

export interface VerifyOtpResponse {
  status: string;
  data: {
    userId: number;
    username: string;
    status: string;
    verifiedAt: string | null;
  };
  error: string | null;
}

export interface LoginResponse {
  status: string;
  data: {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phoneNumber: string;
    aadhaarNumber: string;
    isOtpSentToUser: boolean;
    nsimDocumentKey: string;
  };
  error: string | null;
}

export const authService = {
  // Login endpoint
  login: async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
    const url = `/users/login`;
    console.log('🚀 Login API Call:', {
      url,
      method: 'POST',
      requestBody: { usernameOrEmail }
    });

    try {
      // Use axios directly for login to ensure proper cookie handling
      const response = await apiClient.post(url, {
        usernameOrEmail,
        password
      });

      console.log('✅ Login API Response:', {
        status: response.status,
        data: response.data
      });

      // Store auth token if it's in the response
      if (response.data?.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Login API Error:', {
        status: error.response?.status,
        error: error.response?.data?.error || 'Login failed'
      });
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Registration endpoint
  register: async (data: RegistrationFormData): Promise<ApiResponse<RegistrationData>> => {
    const url = `/users/register`;
    console.log('🚀 Registration API Call:', {
      url,
      method: 'POST',
      requestBody: { ...data, nsimCertificate: '[BASE64_STRING]' },
    });

    try {
      const response = await apiClient.post(url, data);
      console.log('✅ Registration API Response:', {
        status: response.status,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration API Error:', {
        status: error.response?.status,
        error: error.response?.data?.error || 'Registration failed'
      });
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  // OTP verification endpoint
  verifyOtp: async (userId: number, otp: string): Promise<VerifyOtpResponse> => {
    const url = `/users/submit-otp`;
    console.log('🚀 Verify OTP API Call:', {
      url,
      method: 'POST',
      requestBody: { userId, otp }
    });

    try {
      const response = await apiClient.post(url, {
        userId,
        otp
      });
      console.log('✅ Verify OTP API Response:', {
        status: response.status,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Verify OTP API Error:', {
        status: error.response?.status,
        error: error.response?.data?.error || 'OTP verification failed'
      });
      throw new Error(error.response?.data?.error || 'OTP verification failed');
    }
  },

  // Resend OTP endpoint
  resendOtp: async (userId: number): Promise<ApiResponse<RegistrationData>> => {
    const url = `/users/resend-otp`;
    console.log('🚀 Resend OTP API Call:', {
      url,
      method: 'POST',
      requestBody: { userId }
    });

    try {
      const response = await apiClient.post(url, {
        userId
      });
      console.log('✅ Resend OTP API Response:', {
        status: response.status,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      console.error('❌ Resend OTP API Error:', {
        status: error.response?.status,
        error: error.response?.data?.error || 'Failed to resend OTP'
      });
      throw new Error(error.response?.data?.error || 'Failed to resend OTP');
    }
  },
  
  // Logout endpoint
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/users/logout');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove the token even if the API call fails
      localStorage.removeItem('authToken');
    }
  }
};