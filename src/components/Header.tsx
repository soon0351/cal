import React from 'react';
import { Mountain, RotateCcw, Type } from 'lucide-react';

interface HeaderProps {
  isLargeFont: boolean;
  onToggleFontSize: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLargeFont,
  onToggleFontSize,
  onReset,
}) => {
  return (
    <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Mountain className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-emerald-300">충북 단양 국가지질공원</span>
              <span className="text-[11px] text-emerald-200/80">· UNESCO 지질</span>
            </div>
            <h1 className={`font-bold tracking-tight text-white leading-tight ${isLargeFont ? 'text-xl' : 'text-lg'}`}>
              단양 동굴 여행 계산기
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 어르신 배려 큰 글씨 토글 */}
          <button
            onClick={onToggleFontSize}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
              isLargeFont
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
                : 'bg-emerald-800/80 text-emerald-100 hover:bg-emerald-800 border-emerald-700'
            }`}
            title="글자 크기 변경"
            aria-pressed={isLargeFont}
          >
            <Type className="w-4 h-4" />
            <span>{isLargeFont ? '보통 글씨' : '큰 글씨 모드'}</span>
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={onReset}
            type="button"
            className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700 transition-colors"
            title="초기화"
            aria-label="입력값 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
