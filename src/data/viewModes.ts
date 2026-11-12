/** 맞춤 화면 종류 (Figma: 6 맞춤 화면) */
export const VIEW_MODES = ['기본', '큰 글씨', '쉬운 말', '문자·온라인'] as const
export type ViewMode = (typeof VIEW_MODES)[number]
