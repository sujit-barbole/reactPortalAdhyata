import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1';

export interface RegistrationRequest {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  aadhaarNumber: string;
  nsimNumber?: string;
  nsimCertificate?: string;
}

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

export interface ApiResponse<T> {
  status: string;
  data: T;
  error: string | null;
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

export const apiService = {
  // Login endpoint
  login: async (usernameOrEmail: string, password: string): Promise<LoginResponse> => {
    const url = `${API_BASE_URL}/users/login`;
    console.log('🚀 Login API Call:', {
      url,
      method: 'POST',
      requestBody: { usernameOrEmail }
    });

    try {
      const response = await axios.post(url, {
        usernameOrEmail,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Login API Response:', {
        status: response.status,
        data: response.data
      });
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
    const url = `${API_BASE_URL}/users/register`;
    console.log('🚀 Registration API Call:', {
      url,
      method: 'POST',
      requestBody: { ...data, nsimCertificate: '[BASE64_STRING]' },
    });

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
    const url = `${API_BASE_URL}/users/submit-otp`;
    console.log('🚀 Verify OTP API Call:', {
      url,
      method: 'POST',
      requestBody: { userId, otp }
    });

    try {
      const response = await axios.post(url, {
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
    const url = `${API_BASE_URL}/resend-otp`;
    console.log('🚀 Resend OTP API Call:', {
      url,
      method: 'POST',
      requestBody: { userId }
    });

    try {
      const response = await axios.post(url, {
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
  }
};

// Make sure the file is treated as a module
export { };
