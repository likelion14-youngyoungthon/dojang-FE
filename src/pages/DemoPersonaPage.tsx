import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BackLink } from '../components/BackLink'
import { PersonaRow } from '../components/PersonaRow'
import { StartLayout } from '../components/StartLayout'
import { PERSONAS } from '../data/personas'
import { useAccountActions } from '../session/useAccountActions'

/** A1-2 체험 인물 고르기 (API: POST /auth/demo · POST /judge) */
export function DemoPersonaPage() {
  const navigate = useNavigate()
  const { startDemo } = useAccountActions()
  const [selectedId, setSelectedId] = useState(PERSONAS[1].id)

  const handleSelect = (persona: (typeof PERSONAS)[number]) => {
    setSelectedId(persona.id)
    startDemo(persona)
  }

  return (
    <StartLayout gap="md" footer={<p className="text-13 text-text-sub">체험 계정은 여럿이 함께 써서 기록이 섞일 수 있어요.</p>}>
      <div className="flex flex-col items-start gap-1.5">
        <BackLink onClick={() => navigate('/')} />
        <h1 className="text-32 font-bold text-text-strong">체험할 인물을 골라 주세요</h1>
      </div>

      <div className="flex flex-col gap-3">
        {PERSONAS.map((persona) => (
          <PersonaRow
            key={persona.id}
            persona={persona}
            selected={persona.id === selectedId}
            onSelect={() => handleSelect(persona)}
          />
        ))}
      </div>
    </StartLayout>
  )
}
