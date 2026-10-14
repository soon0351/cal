import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { SettlementDetail } from '../utils/calculator';
import { PeopleCount } from '../types/travel';

declare global {
  interface Window {
    Kakao?: any;
  }
}

interface KakaoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareText: string;
  settlement: SettlementDetail;
  courseTitle: string;
  people: PeopleCount;
  isLargeFont: boolean;
}

export const KakaoShareModal: React.FC<KakaoShareModalProps> = ({
  isOpen,
  onClose,
  shareText,
  settlement,
  courseTitle,
  people,
  isLargeFont,
}) => {
  const [copied, setCopied] = useState(false);
  const [kakaoStatus, setKakaoStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. One-click clipboard copy
  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // 2. Mobile Native Web Share API (Opens KakaoTalk natively on smartphones)
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: '단양 동굴 여행 정산서',
          text: shareText,
          url: window.location.href,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyClipboard();
        }
      }
    } else {
      handleCopyClipboard();
    }
  };

  // 3. KakaoTalk SDK or Scheme Trigger
  const handleKakaoShare = () => {
    try {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          // Initialize with demo/public key for standard feed share
          try {
            window.Kakao.init('818efbb02047b3dfeb9c66e2c3498877');
          } catch (e) {
            console.log('Kakao init fallback', e);
          }
        }

        if (window.Kakao.Share) {
          window.Kakao.Share.sendDefault({
            objectType: 'text',
            text: shareText,
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Kakao SDK share failed, falling back to Web Share', err);
    }

    // If SDK is blocked or unavailable, use native share or clipboard
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      handleNativeShare();
    } else {
      handleCopyClipboard();
      setKakaoStatus('정산 내용이 복사되었습니다! 카카오톡 대화방에 붙여넣기하세요.');
      setTimeout(() => setKakaoStatus(null), 4000);
    }
  };

  // 4. SMS Direct Send
  const handleSmsShare = () => {
    const encodedBody = encodeURIComponent(shareText);
    window.location.href = `sms:?body=${encodedBody}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kakao-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE500] text-stone-900 flex items-center justify-center font-black shadow-sm">
              <MessageCircle className="w-6 h-6 fill-stone-900 text-stone-900" />
            </div>
            <div>
              <h3
                id="kakao-modal-title"
                className={`font-black text-stone-900 ${isLargeFont ? 'text-xl' : 'text-lg'}`}
              >
                카카오톡으로 정산 내용 공유하기
              </h3>
              <p className="text-xs text-stone-500">
                여행 후 가족·친구 단톡방에 1초 만에 전송하세요
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800">
                총 {settlement.totalPeople}명 정산
              </span>
              <div className="text-sm font-bold text-stone-900">
                1인당 분담금 (1/N)
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500">총 {settlement.grandTotal.toLocaleString()}원</span>
              <div className={`font-black text-amber-900 ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
                {settlement.perPersonCost.toLocaleString()}
                <span className="text-base font-bold text-amber-800">원</span>
              </div>
            </div>
          </div>

          {/* Toast Notice if triggered */}
          {kakaoStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{kakaoStatus}</span>
            </div>
          )}

          {/* Action Buttons for Seniors */}
          <div className="space-y-2.5">
            {/* 1. Main KakaoTalk Button */}
            <button
              type="button"
              onClick={handleKakaoShare}
              className="w-full py-4 px-4 rounded-2xl bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-stone-950 font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-6 h-6 fill-stone-950" />
              <span>카카오톡으로 바로 보내기</span>
            </button>

            {/* 2. Web Share / Smartphone Native Share */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Share2 className="w-5 h-5" />
              <span>스마트폰 공유하기 (카톡·밴드·문자)</span>
            </button>

            {/* 3. Clipboard Copy & SMS Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyClipboard}
                className={`py-3 px-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                  copied
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>정산서 텍스트 복사</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSmsShare}
                className="py-3 px-3 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Smartphone className="w-4 h-4 text-stone-600" />
                <span>문자메시지 전송</span>
              </button>
            </div>
          </div>

          {/* Formatted Text Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1.5">
              <span>카카오톡 전송 내용 미리보기:</span>
              <span className="text-[11px] text-stone-400">자동 줄바꿈 정리됨</span>
            </div>
            <pre className="p-3.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-stone-200 selection:bg-amber-200">
              {shareText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-stone-100 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm transition-colors"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
