import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, Footprints, Thermometer, Accessibility, HeartPulse } from 'lucide-react';

interface SeniorGuideTipsProps {
  isLargeFont: boolean;
}

export const SeniorGuideTips: React.FC<SeniorGuideTipsProps> = ({ isLargeFont }) => {
  const [isOpen, setIsOpen] = useState(true);

  const tips = [
    {
      icon: Footprints,
      title: '미끄럼 방지 신발 필수 착용',
      desc: '동굴 내부는 지하수와 습기로 인해 바닥이 축축합니다. 굽 높은 신발이나 슬리퍼 대신 접지력이 좋은 운동화를 꼭 착용하세요.',
    },
    {
      icon: Thermometer,
      title: '체온 보호용 얇은 겉옷 챙기기',
      desc: '고수동굴과 온달동굴은 사계절 내내 약 14℃~15℃를 유지하여 바깥보다 서늘합니다. 어르신들은 가벼운 바람막이나 얇은 카디건을 걸치시는 것이 좋습니다.',
    },
    {
      icon: Accessibility,
      title: '고수동굴 계단 관람 조절 (무리 금지)',
      desc: '고수동굴은 약 720개의 철제 계단이 있습니다. 무릎 관절이 약하신 어르신은 초반 평탄 구간과 전시관을 관람하시고 가파른 나선 구간 전 쉼터에서 휴식하실 수 있습니다.',
    },
    {
      icon: HeartPulse,
      title: '동굴 내부 화장실 없음 사전 이용',
      desc: '동굴 속에는 화장실이 전혀 없습니다. 관람 소요시간이 40분~1시간 20분이므로 반드시 매표소 및 주차장 화장실을 먼저 다녀오신 후 입장하세요.',
    },
  ];

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-900" />
          </div>
          <div>
            <h3 className={`font-bold text-amber-950 ${isLargeFont ? 'text-lg' : 'text-base'}`}>
              어르신 & 가족 안심 동굴 관람 4대 수칙
            </h3>
            <p className="text-xs text-amber-800">
              안전하고 편안한 단양 지질 여행을 위한 사전 체크리스트
            </p>
          </div>
        </div>

        <div className="p-1 rounded-md text-amber-800 hover:bg-amber-100">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-amber-200/80">
          {tips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/90 border border-amber-200/60 flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                    {tip.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
