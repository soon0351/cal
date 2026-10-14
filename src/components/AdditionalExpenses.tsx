import React from 'react';
import { OptionalAttraction, AdditionalCostSettings, PeopleCount } from '../types/travel';
import { Landmark, Utensils, Hotel, Fuel, Check, Plus, Minus } from 'lucide-react';

interface AdditionalExpensesProps {
  attractions: OptionalAttraction[];
  people: PeopleCount;
  settings: AdditionalCostSettings;
  onToggleAttraction: (id: string) => void;
  onUpdateSettings: (newSettings: Partial<AdditionalCostSettings>) => void;
  isLargeFont: boolean;
}

export const AdditionalExpenses: React.FC<AdditionalExpensesProps> = ({
  attractions,
  people,
  settings,
  onToggleAttraction,
  onUpdateSettings,
  isLargeFont,
}) => {
  const totalPeople = people.adult + people.senior + people.teen + people.child;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`font-bold text-stone-900 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
            4. 기타 지질명소 및 여행 실비 정산
          </h2>
          <p className="text-xs text-stone-500">
            도담삼봉·스카이워크 및 식비, 숙박비 등을 더해 완벽한 정산서를 완성하세요
          </p>
        </div>
      </div>

      {/* Optional Attractions Grid */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-stone-600">
          단양 대표 지질·관광 명소 추가 (선택):
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {attractions.map((spot) => {
            const spotFee =
              spot.prices.adult * people.adult +
              spot.prices.senior * people.senior +
              spot.prices.teen * people.teen +
              spot.prices.child * people.child;
            const hasFee = spotFee > 0 || spot.parkingFee > 0;

            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => onToggleAttraction(spot.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  spot.selected
                    ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400/30 shadow-sm'
                    : 'bg-stone-50/60 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {spot.category === 'geology' ? '지질명소' : '체험전시'}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        spot.selected
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {spot.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{spot.name}</div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                    {spot.highlight}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 text-xs flex items-center justify-between font-semibold">
                  <span className="text-stone-500">예상 비용:</span>
                  <span className="text-emerald-900 font-bold">
                    {hasFee
                      ? `${(spotFee + (totalPeople > 0 ? spot.parkingFee : 0)).toLocaleString()}원`
                      : '입장료 무료'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Practical Travel Expenses (식비, 숙박비, 유류비) */}
      <div className="pt-3 border-t border-stone-100 space-y-3">
        <div className="text-xs font-bold text-stone-600">
          여행 공통 경비 (식비·숙박·유류비 N빵 포함 옵션):
        </div>

        {/* 1. Meals */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-bold text-stone-900">식사 및 먹거리 비용</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs font-semibold text-stone-600">포함</span>
              <input
                type="checkbox"
                checked={settings.includeMeals}
                onChange={(e) => onUpdateSettings({ includeMeals: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
            </label>
          </div>

          {settings.includeMeals && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-600">1인당 1끼 단가:</span>
                <select
                  value={settings.mealCostPerPerson}
                  onChange={(e) =>
                    onUpdateSettings({ mealCostPerPerson: Number(e.target.value) })
                  }
                  className="font-bold text-stone-800 bg-stone-50 border border-stone-300 rounded px-2 py-1 text-xs"
                >
                  <option value={10000}>10,000원 (가벼운 식사/순대국)</option>
                  <option value={15000}>15,000원 (마늘정식/일반식)</option>
                  <option value={20000}>20,000원 (마늘떡갈비 특선)</option>
                  <option value={30000}>30,000원 (쏘가리매운탕 정식)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="text-stone-600">식사 횟수:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ mealCount: Math.max(1, settings.mealCount - 1) })
                    }
                    className="w-7 h-7 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-stone-900 w-5 text-center">
                    {settings.mealCount}
                  </span>
                  <span className="text-stone-500">끼</span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({ mealCount: Math.min(6, settings.mealCount + 1) })
                    }
                    className="w-7 h-7 rounded border border-stone-300 flex items-center justify-center hover:bg-stone-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Accommodation & Fuel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Accommodation */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-stone-900">숙박비 (1박 기준)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.includeStay}
                onChange={(e) => onUpdateSettings({ includeStay: e.target.checked })}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300"
              />
            </div>
            {settings.includeStay && (
              <select
                value={settings.stayCost}
                onChange={(e) => onUpdateSettings({ stayCost: Number(e.target.value) })}
                className="w-full font-bold text-stone-800 bg-white border border-stone-300 rounded-lg p-2 text-xs"
              >
                <option value={100000}>100,000원 (일반 모텔/게스트하우스)</option>
                <option value={150000}>150,000원 (패밀리 펜션 1실)</option>
                <option value={200000}>200,000원 (소노문 단양 리조트)</option>
                <option value={280000}>280,000원 (고급 한옥 독채/스위트)</option>
              </select>
            )}
          </div>

          {/* Fuel & Toll */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-bold text-stone-900">차량 유류비 & 톨비</span>
            </div>
            <select
              value={settings.fuelAndToll}
              onChange={(e) => onUpdateSettings({ fuelAndToll: Number(e.target.value) })}
              className="w-full font-bold text-stone-800 bg-white border border-stone-300 rounded-lg p-2 text-xs"
            >
              <option value={0}>선택 안함 (0원)</option>
              <option value={20000}>20,000원 (인근 충청/강원 출발)</option>
              <option value={40000}>40,000원 (수도권/경기 승용차 1대)</option>
              <option value={60000}>60,000원 (영남/호남 출발 및 장거리)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
