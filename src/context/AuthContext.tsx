import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiService } from '../services/api';

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
  nsimDocumentKey: string;
}

interface AuthContextType {
  userRole: UserRole;
  userData: UserData | null;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await apiService.login(usernameOrEmail, password);
      
      if (response.status === 'SUCCESS') {
        const { role, status } = response.data;
        
        // Map TRADING_ASSISTANT to 'ta' for internal use
        let mappedRole: UserRole = null;
        if (role === 'TRADING_ASSISTANT') {
          mappedRole = 'ta';
        } else if (role === 'ADMIN') {
          mappedRole = 'admin';
        }
        
        // Check user status for TRADING_ASSISTANT
        if (role === 'TRADING_ASSISTANT') {
          switch (status) {
            case 'REJECTED_BY_ADMIN':
              throw new Error('Your account has been rejected by the admin. Please contact admin for more information.');
            case 'PENDING_VERIFICATION_FROM_ADMIN':
              throw new Error('Your account is pending verification from admin. Please wait for approval.');
            case 'APPROVED_BY_ADMIN':
              // Allow login to proceed
              break;
            default:
              throw new Error('Your account status is not valid. Please contact admin.');
          }
        }

        setUserRole(mappedRole);
        setUserData(response.data);
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUserRole(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        userRole, 
        userData,
        setUserRole, 
        isAuthenticated: !!userRole,
        login,
        logout
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