import { useId } from "react";
import { GU_LIST, type Gu } from "../data/regions";

interface GuSegmentedProps {
  value: Gu;
  onChange: (gu: Gu) => void;
  /** lg: 52px/16px (01 화면), md: 48px/15px (20 모달) */
  size?: "md" | "lg";
}

/** 처인구·기흥구·수지구 세그먼트 선택 (Figma: Field / 구) */
export function GuSegmented({
  value,
  onChange,
  size = "lg",
}: GuSegmentedProps) {
  const labelId = useId();
  return (
    <div className="flex flex-col gap-2">
      <p id={labelId} className="text-[15px] font-bold">
        구
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={`flex gap-1 rounded-lg bg-gray-50 p-1 ${size === "lg" ? "h-13" : "h-12"}`}
      >
        {GU_LIST.map((gu) => {
          const selected = value === gu;
          return (
            <button
              key={gu}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(gu)}
              className={`flex-1 rounded-md transition-colors cursor-pointer ${size === "lg" ? "text-[16px]" : "text-[15px]"} ${
                selected
                  ? "border-[1.5px] border-primary bg-white font-bold text-primary"
                  : "font-medium text-gray-700 hover:text-gray-900"
              }`}
            >
              {gu}
            </button>
          );
        })}
      </div>
    </div>
  );
}
