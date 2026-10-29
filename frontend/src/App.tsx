import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';

// Main Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

// Knowledge & Research Pages
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const EvidenceExplorerPage = lazy(() => import('./pages/EvidenceExplorerPage'));
const KnowledgeGraphPage = lazy(() => import('./pages/KnowledgeGraphPage'));
const SourceFreshnessPage = lazy(() => import('./pages/SourceFreshnessPage'));

// Autonomous Operations Pages
const MissionSupervisorPage = lazy(() => import('./pages/MissionSupervisorPage'));
const WorkflowBuilderPage = lazy(() => import('./pages/WorkflowBuilderPage'));
const MissionHistoryPage = lazy(() => import('./pages/MissionHistoryPage'));
const ScheduledMissionsPage = lazy(() => import('./pages/ScheduledMissionsPage'));
const ExecutionRecoveryPage = lazy(() => import('./pages/ExecutionRecoveryPage'));

// Analytics & Quality Pages
const DataAnalysisLabPage = lazy(() => import('./pages/DataAnalysisLabPage'));
const EvaluationLabPage = lazy(() => import('./pages/EvaluationLabPage'));

// System & Governance Pages
const SecurityPermissionsPage = lazy(() => import('./pages/SecurityPermissionsPage'));
const AuditTrailPage = lazy(() => import('./pages/AuditTrailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('nexus_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-black text-slate-800 dark:text-white">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected 17 Enterprise Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 1. MAIN */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/reports" element={<ReportsPage />} />

          {/* 2. KNOWLEDGE & RESEARCH */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/evidence" element={<EvidenceExplorerPage />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="/source-freshness" element={<SourceFreshnessPage />} />

          {/* 3. AUTONOMOUS OPERATIONS */}
          <Route path="/supervisor" element={<MissionSupervisorPage />} />
          <Route path="/workflows" element={<WorkflowBuilderPage />} />
          <Route path="/mission-history" element={<MissionHistoryPage />} />
          <Route path="/schedules" element={<ScheduledMissionsPage />} />
          <Route path="/execution-recovery" element={<ExecutionRecoveryPage />} />

          {/* 4. ANALYTICS & QUALITY */}
          <Route path="/analysis-lab" element={<DataAnalysisLabPage />} />
          <Route path="/evaluation" element={<EvaluationLabPage />} />

          {/* 5. SYSTEM & GOVERNANCE */}
          <Route path="/security" element={<SecurityPermissionsPage />} />
          <Route path="/audit-trail" element={<AuditTrailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
