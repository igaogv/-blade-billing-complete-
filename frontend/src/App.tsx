// FORCE REBUILD TIMESTAMP: 2026-02-23 14:32:15 ✅ CORS FIX & USERID SECURITY
// Frontend updated: VITE_API_URL corrected to blade-billing-complete
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  console.log('🚀 Blade Billing Frontend v1.0.2 - CORS & Security Fixes Applied');
  console.log('✅ API Backend: https://blade-billing-complete.vercel.app/api');
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/cadastre-se" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
