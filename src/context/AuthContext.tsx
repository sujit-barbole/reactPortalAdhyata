import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'ta' | 'nta' | null;

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Login attempt with:', { email, password });
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === 'admin@gmail.com' && password === 'admin') {
      console.log('AuthContext: Admin login successful');
      setUserRole('admin');
    } else if (email === 'ta@gmail.com' && password === 'ta') {
      console.log('AuthContext: TA login successful');
      setUserRole('ta');
    } else if (email === 'nta@gmail.com' && password === 'nta') {
      console.log('AuthContext: NTA login successful');
      setUserRole('nta');
    } else {
      console.log('AuthContext: Invalid credentials');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    setUserRole(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        userRole, 
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