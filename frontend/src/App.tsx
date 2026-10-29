import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const AuthLayout = lazy(() => import('./layouts/AuthLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const MainApp = lazy(() => import('./MainApp'));

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing - Zero extra JS for ultra-fast Lighthouse score */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route
        element={
          <Suspense fallback={null}>
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          </Suspense>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated 17-page Operating System */}
      <Route
        path="/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-[#f8fafc] dark:bg-black" />}>
            <MainApp />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default App;
