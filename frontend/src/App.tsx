import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';

// Main Pages (Direct imports for 0ms instantaneous tab switching)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import ReportsPage from './pages/ReportsPage';

// Knowledge & Research Pages
import DocumentsPage from './pages/DocumentsPage';
import EvidenceExplorerPage from './pages/EvidenceExplorerPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import SourceFreshnessPage from './pages/SourceFreshnessPage';

// Autonomous Operations Pages
import MissionSupervisorPage from './pages/MissionSupervisorPage';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';
import MissionHistoryPage from './pages/MissionHistoryPage';
import ScheduledMissionsPage from './pages/ScheduledMissionsPage';
import ExecutionRecoveryPage from './pages/ExecutionRecoveryPage';

// Analytics & Quality Pages
import DataAnalysisLabPage from './pages/DataAnalysisLabPage';
import EvaluationLabPage from './pages/EvaluationLabPage';

// System & Governance Pages
import SecurityPermissionsPage from './pages/SecurityPermissionsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SettingsPage from './pages/SettingsPage';

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

      {/* Protected 17 Enterprise Routes - Instant Synchronous Mount */}
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
  );
};

export default App;
