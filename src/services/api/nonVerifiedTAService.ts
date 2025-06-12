// src/services/api/nonVerifiedTAService.ts
import { apiClient, ApiResponse, handleApiError } from './apiConfig';

// Define API response type for agreement signing
export interface AgreementResponse {
  userId: number;
  username: string;
  status: string;
  url: string;
  updatedAt: string;
}

// Define API response type for study submission
export interface StudySubmissionRequest {
  userId: number;
  stockExchange: string;
  stockName: string;
  stockIndex: string;
  currentPrice: number;
  expectedPrice: number;
  action: string;
  analysis: string;
}

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

export const nonVerifiedTAService = {
  // Sign TA agreement
  signAgreement: async (userId: number): Promise<ApiResponse<AgreementResponse>> => {
    const url = `/users/${userId}/sign-agreement`;

    try {
      const response = await apiClient.post(url);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to sign agreement');
    }
  },

  // Get user agreement status
  getAgreementStatus: async (userId: number): Promise<ApiResponse<any>> => {
    const url = `/users/${userId}/agreement-status`;

    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to get agreement status');
    }
  },

  // Submit a new study
  submitStudy: async (studyData: StudySubmissionRequest): Promise<ApiResponse<StudyResponse>> => {
    const url = `/studies`;

    try {
      const response = await apiClient.post(url, studyData);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to submit study');
    }
  },

  // Get studies for the current user
  getUserStudies: async (userId: number): Promise<ApiResponse<StudyResponse[]>> => {
    const url = `/studies/by-ta/${userId}`;

    try {
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch your studies');
    }
  }
};
