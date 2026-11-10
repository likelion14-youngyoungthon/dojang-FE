import { useNavigate } from "react-router";
import accessibilityIcon from "../assets/icons/accessibility.svg";

/** 상단 "접근성 설정" 버튼 → 25 접근성 옵션 화면 */
export function AccessibilityButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/accessibility")}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-[14px] font-medium text-gray-900 hover:bg-gray-50 cursor-pointer"
    >
      <img src={accessibilityIcon} alt="" width={18} height={18} />
      접근성 설정
    </button>
  );
}
