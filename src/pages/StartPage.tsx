import { useNavigate } from 'react-router'
import chevronDownIcon from '../assets/icons/chevron-down.svg'
import { Button } from '../components/Button'
import { NotEligibleModal } from '../components/NotEligibleModal'
import { StepLayout } from '../components/StepLayout'
import { DONG_BY_GU, GU_LIST } from '../data/regions'
import { useFlow } from '../flow/FlowContext'

interface StartPageProps {
  /** true면 02 비대상 안내 모달을 띄운 상태 */
  showNotEligible?: boolean
}

/** 01 서비스 시작 화면 · 02 비대상 안내 화면 */
export function StartPage({ showNotEligible = false }: StartPageProps) {
  const navigate = useNavigate()
  const { state, update } = useFlow()

  const footer = (
    <div className="flex flex-col items-center gap-1.5 text-center text-[14px]">
      <p className="text-gray-700">
        용인시에 거주하는 등록장애인 당사자 또는 지원인이 이용할 수 있어요.
      </p>
      <button
        type="button"
        onClick={() => navigate('/not-eligible')}
        className="font-medium text-primary underline"
      >
        용인시 거주 대상자가 아닌 경우
      </button>
    </div>
  )

  return (
    <>
      <StepLayout step={1} formWidth={480} footer={footer}>
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] leading-[1.35] font-bold">거주 지역을 선택해 주세요</h2>
          <p className="text-[16px] leading-[1.6] text-gray-700">
            선택한 읍면동을 기준으로 관할 행정복지센터와
            <br />
            지원 안내가 연결돼요.
          </p>
        </div>

        <form
          className="flex flex-col gap-7"
          onSubmit={(e) => {
            e.preventDefault()
            navigate('/consent')
          }}
        >
          <div className="flex flex-col gap-2">
            <p id="gu-label" className="text-[15px] font-bold">
              구
            </p>
            <div
              role="radiogroup"
              aria-labelledby="gu-label"
              className="flex h-13 gap-1 rounded-lg bg-gray-50 p-1"
            >
              {GU_LIST.map((gu) => {
                const selected = state.gu === gu
                return (
                  <button
                    key={gu}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => update({ gu, dong: DONG_BY_GU[gu][0] })}
                    className={`flex-1 rounded-md text-[16px] transition-colors ${
                      selected
                        ? 'border-[1.5px] border-primary bg-white font-bold text-primary'
                        : 'font-medium text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {gu}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dong" className="text-[15px] font-bold">
              읍면동
            </label>
            <div className="relative">
              <select
                id="dong"
                value={state.dong}
                onChange={(e) => update({ dong: e.target.value })}
                aria-describedby="dong-hint"
                className="h-13 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white pr-12 pl-4 text-[16px] font-medium text-gray-900 focus:border-primary focus:outline-none"
              >
                {DONG_BY_GU[state.gu].map((dong) => (
                  <option key={dong} value={dong}>
                    {dong}
                  </option>
                ))}
              </select>
              <img
                src={chevronDownIcon}
                alt=""
                width={22}
                height={22}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
              />
            </div>
            <p id="dong-hint" className="text-[14px] text-gray-500">
              이사하셨다면 대화 중에 말씀해 주시면 바꿀 수 있어요.
            </p>
          </div>

          <Button type="submit">선택한 읍면동으로 시작하기</Button>
        </form>
      </StepLayout>

      {showNotEligible && (
        <NotEligibleModal onReselect={() => navigate('/')} onClose={() => navigate('/')} />
      )}
    </>
  )
}
