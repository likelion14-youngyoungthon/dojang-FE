import { BrowserRouter, Link, Route, Routes } from 'react-router'
import { FlowProvider } from './flow/FlowContext'
import { ApplicantPage } from './pages/ApplicantPage'
import { ConsentPage } from './pages/ConsentPage'
import { RelationshipPage } from './pages/RelationshipPage'
import { StartPage } from './pages/StartPage'

function ComingSoon() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-[18px] font-bold">06 대화 입력 화면은 아직 구현 전이에요.</p>
      <Link to="/" className="font-medium text-primary underline">
        처음으로
      </Link>
    </main>
  )
}

function App() {
  return (
    <FlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/not-eligible" element={<StartPage showNotEligible />} />
          <Route path="/consent" element={<ConsentPage />} />
          <Route path="/applicant" element={<ApplicantPage />} />
          <Route path="/relationship" element={<RelationshipPage />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
    </FlowProvider>
  )
}

export default App
