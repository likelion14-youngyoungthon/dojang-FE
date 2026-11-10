import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { Select } from "../components/Select";
import { NotEligibleModal } from "../components/NotEligibleModal";
import { StepLayout } from "../components/StepLayout";
import { GuSegmented } from "../components/GuSegmented";
import { DONG_BY_GU } from "../data/regions";
import { useFlow } from "../flow/FlowContext";

interface StartPageProps {
  /** true면 02 비대상 안내 모달을 띄운 상태 */
  showNotEligible?: boolean;
}

/** 01 서비스 시작 화면 · 02 비대상 안내 화면 */
export function StartPage({ showNotEligible = false }: StartPageProps) {
  const navigate = useNavigate();
  const { state, update } = useFlow();

  const footer = (
    <div className="flex flex-col items-center gap-1.5 text-center text-[14px]">
      <p className="text-gray-700">
        용인시에 거주하는 등록장애인 당사자 또는 지원인이 이용할 수 있어요.
      </p>
      <button
        type="button"
        onClick={() => navigate("/not-eligible")}
        className="font-medium text-primary underline cursor-pointer"
      >
        용인시 거주 대상자가 아닌 경우
      </button>
    </div>
  );

  return (
    <>
      <StepLayout step={1} formWidth={480} footer={footer}>
        <div className="flex flex-col gap-2">
          <h2 className="text-[28px] leading-[1.35] font-bold">
            거주 지역을 선택해 주세요
          </h2>
          <p className="text-[16px] leading-[1.6] text-gray-700">
            선택한 읍면동을 기준으로 관할 행정복지센터와
            <br />
            지원 안내가 연결돼요.
          </p>
        </div>

        <form
          className="flex flex-col gap-7"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/consent");
          }}
        >
          <GuSegmented
            value={state.gu}
            onChange={(gu) => update({ gu, dong: DONG_BY_GU[gu][0] })}
          />

          <Field
            label="읍면동"
            htmlFor="dong"
            hint="이사하셨다면 대화 중에 말씀해 주시면 바꿀 수 있어요."
            hintId="dong-hint"
          >
            <Select
              id="dong"
              aria-describedby="dong-hint"
              options={DONG_BY_GU[state.gu]}
              value={state.dong}
              onChange={(e) => update({ dong: e.target.value })}
            />
          </Field>

          <Button type="submit">선택한 읍면동으로 시작하기</Button>
        </form>
      </StepLayout>

      {showNotEligible && (
        <NotEligibleModal
          onReselect={() => navigate("/")}
          onClose={() => navigate("/")}
        />
      )}
    </>
  );
}
