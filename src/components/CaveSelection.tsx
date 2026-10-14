import React from 'react';
import { CaveSite, PeopleCount } from '../types/travel';
import { Compass, Check, AlertCircle, Sparkles, Thermometer, Footprints, Clock } from 'lucide-react';

interface CaveSelectionProps {
  caves: CaveSite[];
  people: PeopleCount;
  onToggleCave: (caveId: 'gosu' | 'ondal') => void;
  onToggleExperience: (caveId: 'gosu' | 'ondal', expId: string) => void;
  isLargeFont: boolean;
}

export const CaveSelection: React.FC<CaveSelectionProps> = ({
  caves,
  people,
  onToggleCave,
  onToggleExperience,
  isLargeFont,
}) => {
  const totalPeople = people.adult + people.senior + people.teen + people.child;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`font-bold text-stone-900 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
            2. 단양 대표 동굴 입장료 & 체험비 선택
          </h2>
          <p className="text-xs text-stone-500">
            방문할 동굴을 선택하고 원하는 체험 옵션을 체크하세요
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {caves.map((cave) => {
          // Calculate admission for this cave
          const admissionTotal = cave.selected
            ? cave.basePrices.adult * people.adult +
              cave.basePrices.senior * people.senior +
              cave.basePrices.teen * people.teen +
              cave.basePrices.child * people.child
            : 0;

          // Calculate experiences total
          const expTotal = cave.selected
            ? cave.experiences
                .filter((e) => e.selected)
                .reduce((sum, e) => sum + e.pricePerPerson * totalPeople, 0)
            : 0;

          const caveTotal = admissionTotal + expTotal;

          return (
            <div
              key={cave.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                cave.selected
                  ? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20'
                  : 'bg-stone-50 border-stone-200 opacity-80'
              }`}
            >
              {/* Card Header & Visit Selection Button */}
              <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-stone-50 to-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {cave.id === 'gosu' ? '천연기념물 256호' : '천연기념물 262호'}
                    </span>
                    <span className="text-xs text-stone-500">· {cave.tagline}</span>
                  </div>
                  <h3 className={`font-black text-stone-900 mt-1 ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
                    {cave.name}
                  </h3>
                </div>

                {/* Big Visit Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleCave(cave.id)}
                  aria-pressed={cave.selected}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-base transition-all active:scale-95 shadow-sm ${
                    cave.selected
                      ? 'bg-teal-700 text-white hover:bg-teal-800 border border-teal-800'
                      : 'bg-white text-stone-600 border border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                      cave.selected
                        ? 'bg-white text-teal-700 border-white'
                        : 'border-stone-400 bg-stone-50'
                    }`}
                  >
                    {cave.selected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span>{cave.selected ? '방문 코스 포함됨' : '방문 안 함'}</span>
                </button>
              </div>

              {cave.selected ? (
                <div className="p-4 sm:p-5 space-y-4">
                  {/* Real-time Subtotal Highlight */}
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-950 text-sm">
                        {cave.koreanTitle} 합산 금액:
                      </span>
                      <span className="text-xs text-teal-800">
                        (입장료 {admissionTotal.toLocaleString()}원 + 체험비 {expTotal.toLocaleString()}원)
                      </span>
                    </div>
                    <div className={`font-black text-teal-900 ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
                      {caveTotal.toLocaleString()}
                      <span className="text-base font-bold text-teal-800">원</span>
                    </div>
                  </div>

                  {/* Pricing Breakdown badges */}
                  <div>
                    <div className="text-xs font-semibold text-stone-500 mb-2">
                      개인별 기본 입장료 기준:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-stone-100 border border-stone-200 text-center">
                        <span className="text-stone-500 block">성인</span>
                        <span className="font-bold text-stone-800 text-sm">
                          {cave.basePrices.adult.toLocaleString()}원
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
                        <span className="text-amber-700 font-semibold block">경로(65세↑)</span>
                        <span className="font-bold text-amber-900 text-sm">
                          {cave.basePrices.senior.toLocaleString()}원
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-center">
                        <span className="text-blue-700 font-semibold block">청소년</span>
                        <span className="font-bold text-blue-900 text-sm">
                          {cave.basePrices.teen.toLocaleString()}원
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 text-center">
                        <span className="text-orange-700 font-semibold block">어린이</span>
                        <span className="font-bold text-orange-900 text-sm">
                          {cave.basePrices.child.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Experiences Selection */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-bold text-stone-800">
                        선택 체험 프로그램 (체험비 자동 합산)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {cave.experiences.map((exp) => {
                        const totalExpPrice = exp.pricePerPerson * totalPeople;
                        return (
                          <label
                            key={exp.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              exp.selected
                                ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/40'
                                : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={exp.selected}
                              onChange={() => onToggleExperience(cave.id, exp.id)}
                              className="w-5 h-5 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span className={`font-bold text-stone-900 ${isLargeFont ? 'text-base' : 'text-sm'}`}>
                                  {exp.name}
                                </span>
                                <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                  1인 +{exp.pricePerPerson.toLocaleString()}원
                                  {totalPeople > 0 && ` (총 ${totalExpPrice.toLocaleString()}원)`}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 mt-0.5">
                                {exp.description}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cave Info & Senior Caution (어르신 맞춤 안내) */}
                  <div className="pt-2 border-t border-stone-100 space-y-2.5">
                    {/* Quick Specs */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-stone-100 text-stone-700 flex items-center gap-1.5">
                        <Footprints className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{cave.stairsCount}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-100 text-stone-700 flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{cave.temperature}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-100 text-stone-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{cave.duration}</span>
                      </div>
                    </div>

                    {/* Senior friendly notice banner */}
                    <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 flex items-start gap-2 text-xs leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-orange-900">어르신 안심 관람 안내: </strong>
                        {cave.seniorCaution}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-stone-500">
                  선택 시 동굴 입장료 및 체험비가 합산 계산됩니다.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
