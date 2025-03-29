import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/investormanagement" element={<InvestorManagement />} />
          <Route path="/tamanagement" element={<TaManagementPage />} />
          <Route path="/stock-calls" element={<StockCallsPage />} />
          <Route path="/tadashboard" element={<TADashboard />} />
          <Route path="/callhistory" element={<CallHistory />} />
          <Route path="/reconciliation" element={<Reconciliation />} />
          <Route path="/taprofile" element={<TAProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
