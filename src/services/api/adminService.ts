// src/services/api/adminService.ts
import { apiClient, ApiResponse, handleApiError } from './apiConfig';

// Types for admin-related API calls
export interface TAUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INITIATED' | 'WAITING_FOR_OTP_FROM_TA' |
  'PENDING_VERIFICATION_FROM_ADMIN' | 'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' |
  'PENDING_TA_AGREEMENT' | 'TA_AGREEMENT_INITIATED' | 'TA_AGREEMENT_SIGNED' |
  'ADMIN_AGREEMENT_SIGNATURE_INITIATED' | 'ADMIN_AGREEMENT_SIGNATURE_SIGNED' |
  'TA_AGREEMENT_REJECTED' | 'LOCKED';
  phoneNumber: string;
  aadhaarNumber: string;
  nsimNumber: string;
  nsimDocumentKey: string;
  isOtpSentToUser: boolean;
  registeredDate: string;
  registeredTime: string;
  verification: 'OTP Verified' | 'Not Verified';
  initials: string;
}

interface RegistrationDetails {
  registeredAt: string;
}

interface TAUserResponse {
  userResponse: {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phoneNumber: string;
    aadhaarNumber: string;
    isOtpSentToUser: boolean;
    nsimDocumentKey: string | null;
  };
  registrationDetails: RegistrationDetails;
}

export interface AdminApiResponse<T> extends ApiResponse<T> {
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
}

// Define API response type for e-sign agreement
export interface ESignAgreementResponse {
  userId: number;
  username: string;
  status: string;
  eSignUrl: string;
  clientId: string;
}

// Define the StudyResponse interface
export interface StudyResponse {
  id: number;
  userId: number;
  stockExchange: string;
  stockName: string;
  stockIndex: string;
  currentPrice: number;
  expectedPrice: number;
  action: string;
  analysis: string;
  createdAt: string;
  updatedAt: string;
}

export const adminService = {
  // Get users by role and status
  getUsersByRoleAndStatus: async (role: string, status?: string): Promise<ApiResponse<TAUser[]>> => {
    // Build the URL with query parameters
    let url = `/users/by-role-and-status?role=${role}`;

    // Add status parameter if provided
    if (status) {
      url += `&status=${status}`;
    }

    try {
      const response = await apiClient.get(url);

      // Process the response to add initials for each user and format dates
      if (response.data.status === 'SUCCESS' && response.data.data) {
        const taUsers: TAUser[] = response.data.data.map((item: TAUserResponse) => {
          const user = item.userResponse;
          const registeredAt = new Date(item.registrationDetails.registeredAt);

          // Format date as "MMM DD, YYYY"
          const registeredDate = registeredAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          // Format time as "HH:MM AM/PM"
          const registeredTime = registeredAt.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });

          return {
            id: user.id.toString(),
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            phoneNumber: user.phoneNumber,
            aadhaarNumber: user.aadhaarNumber,
            nsimNumber: 'NS-' + Math.floor(1000 + Math.random() * 9000) + '-' + new Date().getFullYear(),
            nsimDocumentKey: user.nsimDocumentKey || null,
            isOtpSentToUser: user.isOtpSentToUser,
            registeredDate: registeredDate,
            registeredTime: registeredTime,
            verification: user.isOtpSentToUser ? 'OTP Verified' : 'Not Verified',
            initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          };
        });

        return {
          status: 'SUCCESS',
          data: taUsers,
          error: null
        };
      }

      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch users');
    }
  },

  // Update TA status - single function to handle all status changes
  updateTAStatus: async (taId: number, newStatus: string, adminId: number): Promise<ApiResponse<any>> => {
    const url = `/admin/users/${adminId}/approve`;

    try {
      const response = await apiClient.post(url, {
        userId: taId,
        status: newStatus
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, `Failed to update user status to ${newStatus}`);
    }
  },

  // Link NSIM certificate from one user to another
  linkNsimCertificate: async (userId: number, nsimCertificateHolderId: number): Promise<ApiResponse<any>> => {
    const url = `/admin/users/${userId}/link-nsim`;

    try {
      const response = await apiClient.post(url, {
        nsimCertificateHolderId
      });
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to link NSIM certificate');
    }
  },

  // E-sign agreement by admin
  eSignAgreementByAdmin: async (userId: number): Promise<ApiResponse<ESignAgreementResponse>> => {
    const url = `/admin/users/${userId}/esign-agreement-by-admin`;

    try {
      const response = await apiClient.post(url);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to initiate e-sign agreement');
    }
  },

  // Get studies by TA ID
  getStudiesByTaId: async (taId: number): Promise<ApiResponse<StudyResponse[]>> => {
    const url = `/studies/by-ta/${taId}`;

    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch studies for this TA');
    }
  }
};
