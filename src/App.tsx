import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TripProvider } from './context/TripContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Pages
import { LandingPage } from './pages/LandingPage'
import { EntryGatewayPage } from './pages/EntryGatewayPage'
import { ClientLoginPage } from './pages/ClientLoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { CreateTripPage } from './pages/CreateTripPage'
import { AssessmentPage } from './pages/AssessmentPage'
import { ScoreResultPage } from './pages/ScoreResultPage'
import { DashboardPage } from './pages/DashboardPage'
import { ChecklistPage } from './pages/ChecklistPage'
import { GuardiansPage } from './pages/GuardiansPage'
import { CheckinPage } from './pages/CheckinPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { SecurityLibraryPage } from './pages/SecurityLibraryPage'
import { PlanSpecExplorerPage } from './pages/PlanSpecExplorerPage'
import { DestinationsPublicPage } from './pages/DestinationsPublicPage'
import { ProfilePage } from './pages/ProfilePage'
import { PresenceLogsPage } from './pages/PresenceLogsPage'
import { PoliceDashboardPage } from './pages/PoliceDashboardPage'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <AuthProvider>
        <TripProvider>
          <Toaster />
          <Sonner />
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/entrar" element={<EntryGatewayPage />} />
              <Route path="/entrar/cliente" element={<ClientLoginPage />} />
              <Route path="/login" element={<Navigate to="/entrar/cliente" replace />} />
              <Route path="/cadastro" element={<RegisterPage />} />
              <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Admin protected routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Police protected routes */}
              <Route
                path="/police/dashboard"
                element={
                  <ProtectedRoute requirePolice>
                    <PoliceDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/police" element={<Navigate to="/police/dashboard" replace />} />

              {/* Public exploratory flow */}
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/create-trip" element={<CreateTripPage />} />
              <Route path="/trips/new" element={<CreateTripPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/score-result" element={<ScoreResultPage />} />
              <Route path="/destinos" element={<DestinationsPublicPage />} />
              <Route path="/destinations" element={<Navigate to="/destinos" replace />} />
              <Route path="/security-library" element={<SecurityLibraryPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/plan-spec" element={<PlanSpecExplorerPage />} />

              {/* Authenticated traveler protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklist"
                element={
                  <ProtectedRoute>
                    <ChecklistPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guardians"
                element={
                  <ProtectedRoute>
                    <GuardiansPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkin"
                element={
                  <ProtectedRoute>
                    <CheckinPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/presence-logs"
                element={
                  <ProtectedRoute>
                    <PresenceLogsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/presenca" element={<Navigate to="/presence-logs" replace />} />
              <Route path="/media" element={<Navigate to="/presence-logs" replace />} />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Navigate to="/perfil" replace />} />

              {/* Helper aliases */}
              <Route path="/library" element={<Navigate to="/security-library" replace />} />
              <Route path="/trip/:id/checkin" element={<Navigate to="/checkin" replace />} />
              <Route path="/quiz" element={<Navigate to="/assessment" replace />} />
              <Route path="/score" element={<Navigate to="/score-result" replace />} />
              <Route path="/safety" element={<Navigate to="/security-library" replace />} />
              <Route path="/ajuda" element={<Navigate to="/security-library" replace />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </TripProvider>
      </AuthProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
