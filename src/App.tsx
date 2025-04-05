import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminDashboard from './pages/AdminDashboard';
import InvestorManagement from './pages/InvestorManagement';
import TaManagementPage from './pages/TaManagementPage';
import StockCallsPage from './pages/StockCallsPage';
import TADashboard from './pages/TADashboard';
import CallHistory from './pages/CallHistory';
import Reconciliation from './pages/Reconciliation';
import TAProfile from './pages/TAProfile';
import BucketManagementPage from './pages/BucketManagementPage';
import StockListPage from './pages/StockListPage';
import NonVerifiedTADashboard from './pages/NonVerifiedTADashboard';
import NonVerifiedTAProfile from './pages/NonVerifiedTAProfile';
import SubmitStudy from './pages/SubmitStudy';
import StudyHistory from './pages/StudyHistory';
// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            
            {/* Admin Routes */}
            <Route path="/admindashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/investormanagement" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <InvestorManagement />
              </ProtectedRoute>
            } />
            <Route path="/tamanagement" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TaManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/stock-calls" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StockCallsPage />
              </ProtectedRoute>
            } />
            <Route path="/bucket-management" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BucketManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/stocklist" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StockListPage />
              </ProtectedRoute>
            } />

            {/* TA Routes */}
            <Route path="/tadashboard" element={
              <ProtectedRoute allowedRoles={['ta']}>
                <TADashboard />
              </ProtectedRoute>
            } />
            <Route path="/callhistory" element={
              <ProtectedRoute allowedRoles={['ta']}>
                <CallHistory />
              </ProtectedRoute>
            } />
            <Route path="/reconciliation" element={
              <ProtectedRoute allowedRoles={['ta']}>
                <Reconciliation />
              </ProtectedRoute>
            } />
            <Route path="/taprofile" element={
              <ProtectedRoute allowedRoles={['ta']}>
                <TAProfile />
              </ProtectedRoute>
            } />

            {/* Non-Verified TA Routes */}
            <Route path="/nonverifiedtadashboard" element={
              <ProtectedRoute allowedRoles={['nta']}>
                <NonVerifiedTADashboard />
              </ProtectedRoute>
            } />
            <Route path="/nonverifiedtaprofile" element={
              <ProtectedRoute allowedRoles={['nta']}>
                <NonVerifiedTAProfile />
              </ProtectedRoute>
            } />
            <Route path="/submit-study" element={
              <ProtectedRoute allowedRoles={['nta']}>
                <SubmitStudy />
              </ProtectedRoute>
            } />
            <Route path="/study-history" element={
              <ProtectedRoute allowedRoles={['nta']}>
                <StudyHistory />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
