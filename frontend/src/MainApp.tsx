import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Direct synchronous imports for 0ms instantaneous tab switching inside authenticated app
import DashboardPage from './pages/DashboardPage';
import WorkspacePage from './pages/WorkspacePage';
import ReportsPage from './pages/ReportsPage';
import DocumentsPage from './pages/DocumentsPage';
import EvidenceExplorerPage from './pages/EvidenceExplorerPage';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import SourceFreshnessPage from './pages/SourceFreshnessPage';
import MissionSupervisorPage from './pages/MissionSupervisorPage';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage';
import MissionHistoryPage from './pages/MissionHistoryPage';
import ScheduledMissionsPage from './pages/ScheduledMissionsPage';
import ExecutionRecoveryPage from './pages/ExecutionRecoveryPage';
import DataAnalysisLabPage from './pages/DataAnalysisLabPage';
import EvaluationLabPage from './pages/EvaluationLabPage';
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

export const MainApp: React.FC = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route element={<MainLayout />}>
          {/* 1. MAIN */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="reports" element={<ReportsPage />} />

          {/* 2. KNOWLEDGE & RESEARCH */}
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="evidence" element={<EvidenceExplorerPage />} />
          <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="source-freshness" element={<SourceFreshnessPage />} />

          {/* 3. AUTONOMOUS OPERATIONS */}
          <Route path="supervisor" element={<MissionSupervisorPage />} />
          <Route path="workflows" element={<WorkflowBuilderPage />} />
          <Route path="mission-history" element={<MissionHistoryPage />} />
          <Route path="schedules" element={<ScheduledMissionsPage />} />
          <Route path="execution-recovery" element={<ExecutionRecoveryPage />} />

          {/* 4. ANALYTICS & QUALITY */}
          <Route path="analysis-lab" element={<DataAnalysisLabPage />} />
          <Route path="evaluation" element={<EvaluationLabPage />} />

          {/* 5. SYSTEM & GOVERNANCE */}
          <Route path="security" element={<SecurityPermissionsPage />} />
          <Route path="audit-trail" element={<AuditTrailPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default MainApp;
