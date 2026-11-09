import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { FlowProvider } from './flow/FlowContext'
import { AccessibilityPage } from './pages/AccessibilityPage'
import { ApplicantPage } from './pages/ApplicantPage'
import { ChatInputPage } from './pages/ChatInputPage'
import { ConsentPage } from './pages/ConsentPage'
import { CorrectionPage } from './pages/CorrectionPage'
import { ExploreAreaPage } from './pages/ExploreAreaPage'
import { FollowUpQuestionsPage } from './pages/FollowUpQuestionsPage'
import { IncomePage } from './pages/IncomePage'
import { InstitutionDetailPage } from './pages/InstitutionDetailPage'
import { InstitutionListPage } from './pages/InstitutionListPage'
import { ManualInputPage } from './pages/ManualInputPage'
import { MapPage } from './pages/MapPage'
import { PriorApplicationsPage } from './pages/PriorApplicationsPage'
import { RelationshipPage } from './pages/RelationshipPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { ServiceListPage } from './pages/ServiceListPage'
import { ServiceStepsPage } from './pages/ServiceStepsPage'
import { SituationConfirmPage } from './pages/SituationConfirmPage'
import { StartPage } from './pages/StartPage'
import { SummaryExportPage } from './pages/SummaryExportPage'
import { SupplementPage } from './pages/SupplementPage'
import { UnmetServicesPage } from './pages/UnmetServicesPage'
import { VoiceConfirmPage } from './pages/VoiceConfirmPage'

function App() {
  return (
    <FlowProvider>
      <BrowserRouter>
        <Routes>
          {/* 시작 단계 (01~05, 25) */}
          <Route path="/" element={<StartPage />} />
          <Route path="/not-eligible" element={<StartPage showNotEligible />} />
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/applicant" element={<ApplicantPage />} />
          <Route path="/relationship" element={<RelationshipPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />

          {/* 1. 상황 설명하기 (06~08) */}
          <Route path="/chat" element={<ChatInputPage />} />
          <Route path="/chat/voice" element={<VoiceConfirmPage />} />
          <Route path="/chat/manual" element={<ManualInputPage />} />

          {/* 2. 상황 확인하기 (09~12) */}
          <Route path="/confirm" element={<SituationConfirmPage />} />
          <Route path="/prior-applications" element={<PriorApplicationsPage />} />
          <Route path="/questions" element={<FollowUpQuestionsPage />} />
          <Route path="/income" element={<IncomePage />} />

          {/* 3. 남은 신청 보기 (13~15, 21~24, 26) */}
          <Route path="/services" element={<ServiceListPage />} />
          <Route path="/services/unmet" element={<UnmetServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/summary" element={<SummaryExportPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/map/list" element={<InstitutionListPage />} />
          <Route path="/map/explore" element={<ExploreAreaPage />} />
          <Route path="/institutions/:institutionId" element={<InstitutionDetailPage />} />

          {/* 4. 신청 진행 관리 (16~20) */}
          <Route path="/services/:serviceId/steps" element={<ServiceStepsPage />} />
          <Route path="/services/:serviceId/status" element={<ServiceStepsPage modal="status" />} />
          <Route path="/services/:serviceId/relocation" element={<ServiceStepsPage modal="relocation" />} />
          <Route path="/services/:serviceId/supplement" element={<SupplementPage />} />
          <Route path="/services/:serviceId/correct" element={<CorrectionPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </FlowProvider>
  )
}

export default App
