import React from 'react';
import { SettlementDetail } from '../utils/calculator';
import { PeopleCount } from '../types/travel';
import {
  Receipt,
  MessageCircle,
  User,
  Wallet,
} from 'lucide-react';

interface SettlementSummaryProps {
  settlement: SettlementDetail;
  people: PeopleCount;
  onOpenKakaoModal: () => void;
  isLargeFont: boolean;
}

export const SettlementSummary: React.FC<SettlementSummaryProps> = ({
  settlement,
  people,
  onOpenKakaoModal,
  isLargeFont,
}) => {

  return (
    <>
      {/* 1. In-Page Detailed Settlement Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-4">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`font-bold text-stone-900 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
                5. 여행 비용 총계 및 1/N 정산서
              </h2>
              <p className="text-xs text-stone-500">
                인원별 입장료, 체험비, 공통 경비가 실시간 자동 집계되었습니다
              </p>
            </div>
          </div>
        </div>

        {/* Big Total & 1/N Split Display for Seniors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Total Cost */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-1 shadow-sm">
            <div className="text-xs font-semibold text-stone-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-stone-400" />
              <span>총 예상 여행 경비</span>
            </div>
            <div className={`font-black text-amber-300 ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}>
              {settlement.grandTotal.toLocaleString()}
              <span className="text-lg font-bold text-white ml-1">원</span>
            </div>
            <p className="text-[11px] text-stone-400">
              동굴 입장료, 체험비, 주차 및 실비 합산
            </p>
          </div>

          {/* Per-Person Cost (1/N) */}
          <div className="p-4 rounded-2xl bg-emerald-800 text-white space-y-1 shadow-sm">
            <div className="text-xs font-semibold text-emerald-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-300" />
                <span>1인당 분담금 (1/N 정산)</span>
              </span>
              <span className="bg-emerald-700/80 px-2 py-0.5 rounded-full text-[11px] text-emerald-100 font-bold">
                총 {settlement.totalPeople}명 기준
              </span>
            </div>
            <div className={`font-black text-white ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}>
              {settlement.perPersonCost.toLocaleString()}
              <span className="text-lg font-bold text-emerald-200 ml-1">원</span>
            </div>
            <p className="text-[11px] text-emerald-200">
              {settlement.totalPeople > 0
                ? `1인당 균등 부담 시 정산액`
                : '인원을 먼저 1명 이상 선택하세요'}
            </p>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="pt-2 border-t border-stone-100">
          <div className="text-xs font-bold text-stone-600 mb-2.5">
            항목별 상세 영수증:
          </div>

          <div className="space-y-1.5 text-xs sm:text-sm">
            {settlement.breakdownItems.length === 0 ? (
              <div className="p-4 text-center text-stone-400 bg-stone-50 rounded-xl">
                인원을 선택하고 동굴을 선택하면 상세 내역이 표시됩니다.
              </div>
            ) : (
              settlement.breakdownItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-900 truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {item.details}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900 shrink-0 text-sm">
                    {item.amount.toLocaleString()}원
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* In-page Kakao Share Action Button */}
        <button
          type="button"
          onClick={onOpenKakaoModal}
          className="w-full py-4 px-5 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-stone-950 font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-[0.99]"
        >
          <MessageCircle className="w-6 h-6 fill-stone-950" />
          <span>카카오톡으로 정산 내용 공유하기</span>
        </button>
      </div>

      {/* 2. Mobile Sticky Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl p-3 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Price Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold">
              <span className="truncate">총 {settlement.totalPeople}명</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold truncate">
                1인 {settlement.perPersonCost.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-stone-600 font-bold">합계:</span>
              <span className={`font-black text-stone-950 tracking-tight ${isLargeFont ? 'text-xl' : 'text-lg'}`}>
                {settlement.grandTotal.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-stone-700">원</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Kakao Share */}
            <button
              type="button"
              onClick={onOpenKakaoModal}
              className="py-2.5 px-4 rounded-xl bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-stone-950 font-black text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-stone-950 shrink-0" />
              <span>카톡 공유</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
