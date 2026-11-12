import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppliedPage } from './pages/AppliedPage'
import { ComparePage } from './pages/ComparePage'
import { DemoPersonaPage } from './pages/DemoPersonaPage'
import { HouseholdPage } from './pages/HouseholdPage'
import { LoginPage } from './pages/LoginPage'
import { PlacePage } from './pages/PlacePage'
import { ProfilePage } from './pages/ProfilePage'
import { BenefitDetailPage } from './pages/results/BenefitDetailPage'
import { HistoryPage } from './pages/results/HistoryPage'
import { LocationsPage } from './pages/results/LocationsPage'
import { PreparePage } from './pages/results/PreparePage'
import { ResultsPage } from './pages/results/ResultsPage'
import { ResultsProvider } from './results/ResultsContext'
import { SessionProvider } from './session/SessionContext'
import { SituationProvider } from './situation/SituationContext'

function App() {
  return (
    <SessionProvider>
      <SituationProvider>
        <ResultsProvider>
          <BrowserRouter>
            <Routes>
              {/* 1 시작 */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/demo" element={<DemoPersonaPage />} />

              {/* 2 상황 알려 주기 · 4단계 */}
              <Route path="/situation/place" element={<PlacePage />} />
              <Route path="/situation/profile" element={<ProfilePage />} />
              <Route path="/situation/applied" element={<AppliedPage />} />
              <Route path="/situation/household" element={<HouseholdPage />} />

              {/* 3 결과 */}
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/results/locations" element={<LocationsPage />} />
              <Route path="/results/prepare/:officeId" element={<PreparePage />} />
              <Route path="/results/:benefitId" element={<BenefitDetailPage />} />

              {/* 4 진행·다시 방문 */}
              <Route path="/history/:benefitId" element={<HistoryPage />} />

              {/* 5 맞춤 예시 · 시연·발표용 한 화면 비교 */}
              <Route path="/compare" element={<ComparePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ResultsProvider>
      </SituationProvider>
    </SessionProvider>
  )
}

export default App
