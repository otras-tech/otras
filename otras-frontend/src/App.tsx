import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import PageContainer from './components/PageContainer';
import Dashboard from './pages/Dashboard';
import Eligibility from './pages/Eligibility';
import ArthaEngine from './pages/ArthaEngine';
import Exams from './pages/Exams';
import StudyPlan from './pages/StudyPlan';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import CareerAI from './pages/CareerAI';
import MockTests from './pages/MockTests';
import Analytics from './pages/Analytics';
import ExamDetails from './pages/ExamDetails';
import ApplicationStatus from './pages/ApplicationStatus';
import PreviousPapers from './pages/PreviousPapers';
import Subscriptions from './pages/Subscriptions';
import CompanyInstructions from './pages/CompanyInstructions';
import ExamInstructions from './pages/ExamInstructions';
import ArthaTest from './pages/ArthaTest';
import ReferEarn from './pages/ReferEarn';
import TierAssessment from './pages/TierAssessment';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    // Capture referral code from URL
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('referralCode', ref.toUpperCase());
    }
  }, [location.search]);

  return (
    <div className="font-sans">
      {!isAuthPage && (
        <>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            user={user}
            logout={logout}
          />
          <TopHeader collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
        </>
      )}
      <PageContainer collapsed={collapsed} isAuthPage={isAuthPage}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/eligibility" element={<ProtectedRoute><Eligibility /></ProtectedRoute>} />
          <Route path="/artha" element={<ProtectedRoute><ArthaEngine /></ProtectedRoute>} />
          <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
          <Route path="/exams/:id" element={<ProtectedRoute><ExamDetails /></ProtectedRoute>} />
          <Route path="/studyplan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/career" element={<ProtectedRoute><CareerAI /></ProtectedRoute>} />
          <Route path="/mocktests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><ApplicationStatus /></ProtectedRoute>} />
          <Route path="/refer-earn" element={<ProtectedRoute><ReferEarn /></ProtectedRoute>} />
          <Route path="/previous-papers" element={<ProtectedRoute><PreviousPapers /></ProtectedRoute>} />
          <Route path="/company-instructions" element={<ProtectedRoute><CompanyInstructions /></ProtectedRoute>} />
          <Route path="/exam-instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
          <Route path="/artha-test" element={<ProtectedRoute><ArthaTest /></ProtectedRoute>} />
          <Route path="/tier-assessment/:tier" element={<ProtectedRoute><TierAssessment /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </PageContainer>
    </div>
  );
}
