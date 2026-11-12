import { Link } from 'react-router'
import pencilIcon from '../../assets/icons/pencil.svg'
import { describeSituation } from '../../situation/describe'
import { useSituation } from '../../situation/SituationContext'

/**
 * 제목 오른쪽: 만 4세 · 자폐성 장애 · 백암면  ✎ 상황 고치기
 * 다시 방문(A2)일 때는 상황 대신 "11월 12일에 저장한 기록"
 */
export function SituationSummaryLink({ text }: { text?: string }) {
  const { situation } = useSituation()
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-17 text-text-sub">{text ?? describeSituation(situation)}</p>
      <Link to="/situation/place" className="flex items-center gap-1 text-17 font-medium text-primary hover:underline">
        <img src={pencilIcon} alt="" width={16} height={16} />
        상황 고치기
      </Link>
    </div>
  )
}
