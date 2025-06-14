import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authService } from '../services/api/authService';

type UserRole = 'admin' | 'ta' | 'nta' | null;

interface UserData {
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
}

interface AuthContextType {
  userRole: UserRole;
  userData: UserData | null;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<UserData | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await authService.login(usernameOrEmail, password);

      if (response.status === 'SUCCESS') {
        const { role, status } = response.data;

        // Map backend roles to frontend roles
        let mappedRole: UserRole = null;

        if (role === 'ADMIN') {
          mappedRole = 'admin';
        } else if (role === 'TRUSTED_ASSOCIATE') {
          // For TRUSTED_ASSOCIATE, check status to determine if they are 'ta' or 'nta'
          if (status === 'ADMIN_AGREEMENT_SIGNATURE_SIGNED') {
            mappedRole = 'ta'; // Fully verified TA
          } else if ([
            'APPROVED_BY_ADMIN',
            'PENDING_TA_AGREEMENT',
            'TA_AGREEMENT_INITIATED',
            'TA_AGREEMENT_SIGNED',
            'ADMIN_AGREEMENT_SIGNATURE_INITIATED'
          ].includes(status)) {
            mappedRole = 'nta'; // Non-verified TA
          } else {
            throw new Error(`Your account status (${status}) is not valid for login. Please contact admin.`);
          }
        } else if (role === 'ASSOCIATE') {
          // Handle ASSOCIATE role if needed
          throw new Error('Associate login is not supported in this version.');
        } else {
          throw new Error('Invalid role. Please contact admin.');
        }

        // Store the complete user data from the response
        setUserData(response.data);
        setUserRole(mappedRole);

        console.log('Login successful, JWT cookie should be set by the browser');
        console.log('User data stored:', response.data);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call the logout API endpoint
      await authService.logout();
      
      // Clear user data and role
      setUserRole(null);
      setUserData(null);
      
      // Clear any stored data in localStorage
      localStorage.removeItem('userData');
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear the local state even if the API call fails
      setUserRole(null);
      setUserData(null);
      localStorage.removeItem('userData');
    }
  };

  const refreshUserData = async () => {
    try {
      if (!userData || !userData.id) {
        console.error('Cannot refresh user data: No user is logged in');
        return null;
      }

      const response = await authService.getUserProfile(userData.id);
      
      if (response.status === 'SUCCESS' && response.data) {
        const updatedUserData = response.data;
        
        // Update user data in state
        setUserData(updatedUserData);
        
        // Update user role based on the new status
        let newRole: UserRole = null;
        if (updatedUserData.role === 'ADMIN') {
          newRole = 'admin';
        } else if (updatedUserData.role === 'TRUSTED_ASSOCIATE') {
          if (updatedUserData.status === 'ADMIN_AGREEMENT_SIGNATURE_SIGNED') {
            newRole = 'ta';
          } else {
            newRole = 'nta';
          }
        }
        
        setUserRole(newRole);
        
        // Update localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        return updatedUserData;
      } else {
        console.error('Failed to refresh user data:', response.error);
        return null;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        userData,
        setUserRole,
        isAuthenticated: !!userRole,
        login,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
