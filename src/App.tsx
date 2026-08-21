import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import { TripProvider } from './context/TripContext'

import { LandingPage } from './pages/LandingPage'
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
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <TripProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/create-trip" element={<CreateTripPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/score-result" element={<ScoreResultPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/guardians" element={<GuardiansPage />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/library" element={<SecurityLibraryPage />} />
            <Route path="/plan-spec" element={<PlanSpecExplorerPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TripProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
