import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import PrivateLayout from './components/layout/PrivateLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import PricingPage from './pages/public/PricingPage'
import LoginPage from './pages/public/LoginPage'
import SignupPage from './pages/public/SignupPage'

// Private/Dashboard Pages
import DashboardPage from './pages/private/DashboardPage'
import AgentsPage from './pages/private/AgentsPage'
import KnowledgeBasePage from './pages/private/KnowledgeBasePage'
import CallHistoryPage from './pages/private/CallHistoryPage'
import ChatHistoryPage from './pages/private/ChatHistoryPage'
import AnalyticsPage from './pages/private/AnalyticsPage'
import SettingsPage from './pages/private/SettingsPage'

// Product Pages
import VoiceAIPage from './pages/product/VoiceAIPage'
import VideoAIPage from './pages/product/VideoAIPage'
import ChatAIPage from './pages/product/ChatAIPage'
import SMSAIPage from './pages/product/SMSAIPage'
import AgentBuilderPage from './pages/product/AgentBuilderPage'
import WorkflowEnginePage from './pages/product/WorkflowEnginePage'
import KnowledgeBasePublicPage from './pages/product/KnowledgeBasePage'
import IntegrationsPage from './pages/product/IntegrationsPage'

// Solutions Pages
import EducationPage from './pages/solutions/EducationPage'
import HospitalityPage from './pages/solutions/HospitalityPage'
import HealthcarePage from './pages/solutions/HealthcarePage'
import EnterprisePage from './pages/solutions/EnterprisePage'
import LeadsPage from './pages/solutions/LeadsPage'
import SupportPage from './pages/solutions/SupportPage'
import BookingPage from './pages/solutions/BookingPage'
import SurveysPage from './pages/solutions/SurveysPage'

// Resources Pages
import DocsPage from './pages/resources/DocsPage'
import BlogPage from './pages/resources/BlogPage'
import WebinarsPage from './pages/resources/WebinarsPage'
import APIPage from './pages/resources/APIPage'
import HelpPage from './pages/resources/HelpPage'
import CommunityPage from './pages/resources/CommunityPage'
import StatusPage from './pages/resources/StatusPage'
import SecurityPage from './pages/resources/SecurityPage'

// Company Pages
import AboutPage from './pages/company/AboutPage'
import CareersPage from './pages/company/CareersPage'
import PressPage from './pages/company/PressPage'
import ContactPage from './pages/company/ContactPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-neutral-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Public Only Route (redirects to dashboard if already logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-neutral-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* ============================================ */}
      {/* PUBLIC ROUTES - With Navbar & Footer */}
      {/* ============================================ */}
      <Route element={<PublicLayout />}>
        {/* Landing & Pricing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Auth Routes - Only accessible when NOT logged in */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />

        {/* Product Routes */}
        <Route path="/product/voice" element={<VoiceAIPage />} />
        <Route path="/product/video" element={<VideoAIPage />} />
        <Route path="/product/chat" element={<ChatAIPage />} />
        <Route path="/product/sms" element={<SMSAIPage />} />
        <Route path="/product/builder" element={<AgentBuilderPage />} />
        <Route path="/product/workflow" element={<WorkflowEnginePage />} />
        <Route path="/product/knowledge" element={<KnowledgeBasePublicPage />} />
        <Route path="/product/integrations" element={<IntegrationsPage />} />

        {/* Solutions Routes */}
        <Route path="/solutions/education" element={<EducationPage />} />
        <Route path="/solutions/hospitality" element={<HospitalityPage />} />
        <Route path="/solutions/healthcare" element={<HealthcarePage />} />
        <Route path="/solutions/enterprise" element={<EnterprisePage />} />
        <Route path="/solutions/leads" element={<LeadsPage />} />
        <Route path="/solutions/support" element={<SupportPage />} />
        <Route path="/solutions/booking" element={<BookingPage />} />
        <Route path="/solutions/surveys" element={<SurveysPage />} />

        {/* Resources Routes */}
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/webinars" element={<WebinarsPage />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/security" element={<SecurityPage />} />

        {/* Company Routes */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ============================================ */}
      {/* PRIVATE/DASHBOARD ROUTES - With Sidebar */}
      {/* ============================================ */}
      <Route element={<ProtectedRoute><PrivateLayout /></ProtectedRoute>}>
        {/* Dashboard Home */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* BUILD Section */}
        <Route path="/dashboard/agents" element={<AgentsPage />} />
        <Route path="/dashboard/knowledge" element={<KnowledgeBasePage />} />
        
        {/* DEPLOY Section */}
        <Route path="/dashboard/phone-numbers" element={<DashboardPage />} /> {/* Placeholder */}
        <Route path="/dashboard/batch-calls" element={<DashboardPage />} /> {/* Placeholder */}
        
        {/* MONITOR Section */}
        <Route path="/dashboard/calls" element={<CallHistoryPage />} />
        <Route path="/dashboard/chats" element={<ChatHistoryPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/dashboard/quality" element={<DashboardPage />} /> {/* Placeholder */}
        <Route path="/dashboard/alerts" element={<DashboardPage />} /> {/* Placeholder */}
        
        {/* SYSTEM Section */}
        <Route path="/dashboard/billing" element={<SettingsPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* ============================================ */}
      {/* CATCH ALL - Redirect to home */}
      {/* ============================================ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App