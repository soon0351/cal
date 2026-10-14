import React from 'react';
import { Users, Plus, Minus, UserCheck, HeartHandshake, Backpack, Baby } from 'lucide-react';
import { PeopleCount } from '../types/travel';

interface PeopleCounterProps {
  people: PeopleCount;
  onChange: (key: keyof PeopleCount, delta: number) => void;
  isLargeFont: boolean;
}

export const PeopleCounter: React.FC<PeopleCounterProps> = ({
  people,
  onChange,
  isLargeFont,
}) => {
  const total = people.adult + people.senior + people.teen + people.child;

  const categories = [
    {
      key: 'adult' as const,
      label: '성인 (일반)',
      subLabel: '만 19세 ~ 64세',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      count: people.adult,
    },
    {
      key: 'senior' as const,
      label: '경로 우대',
      subLabel: '만 65세 이상 (신분증 지참)',
      icon: HeartHandshake,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      count: people.senior,
    },
    {
      key: 'teen' as const,
      label: '청소년',
      subLabel: '중학생 · 고등학생 (만 13~18세)',
      icon: Backpack,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      count: people.teen,
    },
    {
      key: 'child' as const,
      label: '어린이',
      subLabel: '만 4세 ~ 초등학생',
      icon: Baby,
      color: 'bg-orange-50 text-orange-900 border-orange-200',
      count: people.child,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Title & Total Count Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`font-bold text-stone-900 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
              1. 여행 인원 선택
            </h2>
            <p className="text-xs text-stone-500">
              어르신 경로 할인 및 학생 할인이 자동 적용됩니다
            </p>
          </div>
        </div>

        <div className="flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200">
          <span className="text-xs font-semibold text-stone-600">총 여행 인원:</span>
          <span className={`font-black text-emerald-700 ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
            {total}
          </span>
          <span className="text-sm font-bold text-stone-700">명</span>
        </div>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className={`flex items-center justify-between p-3.5 rounded-xl border ${cat.color} transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/80 border border-stone-200/60 flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-bold text-stone-900 ${isLargeFont ? 'text-lg' : 'text-base'}`}>
                    {cat.label}
                  </div>
                  <div className="text-xs text-stone-600 font-medium">
                    {cat.subLabel}
                  </div>
                </div>
              </div>

              {/* Huge tactile plus & minus buttons for seniors */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(cat.key, -1)}
                  disabled={cat.count <= 0}
                  aria-label={`${cat.label} 1명 감소`}
                  className={`w-12 h-12 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border font-black transition-transform active:scale-95 ${
                    cat.count <= 0
                      ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed'
                      : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50 shadow-sm active:bg-stone-200'
                  }`}
                >
                  <Minus className="w-6 h-6 stroke-[3]" />
                </button>

                <div
                  className={`min-w-10 text-center font-black text-stone-900 select-none ${
                    isLargeFont ? 'text-2xl' : 'text-xl'
                  }`}
                  aria-live="polite"
                >
                  {cat.count}
                </div>

                <button
                  type="button"
                  onClick={() => onChange(cat.key, 1)}
                  aria-label={`${cat.label} 1명 추가`}
                  className="w-12 h-12 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 border border-emerald-800 shadow-sm flex items-center justify-center font-black transition-transform active:scale-95"
                >
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
