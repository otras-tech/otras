import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobManagement from './pages/JobManagement';
import ExamManagement from './pages/ExamManagement';
import TestManagement from './pages/TestManagement';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import UserManagement from './pages/UserManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import PypManagement from './pages/PypManagement';
import SubjectManagement from './pages/SubjectManagement';
import QuestionManagement from './pages/QuestionManagement';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Referrals from './pages/Referrals';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore(state => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/register" element={<AdminRegister />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="jobs" element={<JobManagement />} />
            <Route path="exams" element={<ExamManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="questions" element={<QuestionManagement />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="subscriptions" element={<SubscriptionManagement />} />
            <Route path="pyps" element={<PypManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="referrals" element={<Referrals />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}


export default App;
