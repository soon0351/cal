/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PeopleCount, CaveSite, OptionalAttraction, AdditionalCostSettings } from './types/travel';
import { INITIAL_CAVE_DATA, OPTIONAL_ATTRACTIONS, ITINERARY_COURSES } from './data/danyangData';
import { calculateSettlement, generateKakaoShareText } from './utils/calculator';
import { Header } from './components/Header';
import { PeopleCounter } from './components/PeopleCounter';
import { CaveSelection } from './components/CaveSelection';
import { CourseRecommendation } from './components/CourseRecommendation';
import { AdditionalExpenses } from './components/AdditionalExpenses';
import { SeniorGuideTips } from './components/SeniorGuideTips';
import { SettlementSummary } from './components/SettlementSummary';
import { KakaoShareModal } from './components/KakaoShareModal';

export default function App() {
  // 1. State: People count (default: 2 adults, 1 senior for realistic family tour)
  const [people, setPeople] = useState<PeopleCount>({
    adult: 2,
    senior: 1,
    teen: 0,
    child: 1,
  });

  // 2. State: Caves & Experiences
  const [caves, setCaves] = useState<CaveSite[]>(INITIAL_CAVE_DATA);

  // 3. State: Optional Attractions
  const [attractions, setAttractions] = useState<OptionalAttraction[]>(OPTIONAL_ATTRACTIONS);

  // 4. State: Course selection ('dayTrip' | 'overnight')
  const [selectedCourseId, setSelectedCourseId] = useState<'dayTrip' | 'overnight'>('dayTrip');

  // 5. State: Additional travel expenses
  const [additionalSettings, setAdditionalSettings] = useState<AdditionalCostSettings>({
    includeMeals: true,
    mealCostPerPerson: 15000,
    mealCount: 2,
    includeStay: false,
    stayCost: 150000,
    fuelAndToll: 20000,
  });

  // 6. UI Preferences: Senior Large Font Mode & Modal state
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [isKakaoModalOpen, setIsKakaoModalOpen] = useState<boolean>(false);

  // Handlers
  const handlePeopleChange = (key: keyof PeopleCount, delta: number) => {
    setPeople((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const handleToggleCave = (caveId: 'gosu' | 'ondal') => {
    setCaves((prev) =>
      prev.map((cave) =>
        cave.id === caveId ? { ...cave, selected: !cave.selected } : cave
      )
    );
  };

  const handleToggleExperience = (caveId: 'gosu' | 'ondal', expId: string) => {
    setCaves((prev) =>
      prev.map((cave) => {
        if (cave.id !== caveId) return cave;
        return {
          ...cave,
          experiences: cave.experiences.map((exp) =>
            exp.id === expId ? { ...exp, selected: !exp.selected } : exp
          ),
        };
      })
    );
  };

  const handleToggleAttraction = (id: string) => {
    setAttractions((prev) =>
      prev.map((spot) =>
        spot.id === id ? { ...spot, selected: !spot.selected } : spot
      )
    );
  };

  const handleCourseSelect = (courseId: 'dayTrip' | 'overnight') => {
    setSelectedCourseId(courseId);
    if (courseId === 'overnight') {
      setAdditionalSettings((prev) => ({
        ...prev,
        includeStay: true,
        mealCount: 4,
        fuelAndToll: 40000,
      }));
    } else {
      setAdditionalSettings((prev) => ({
        ...prev,
        includeStay: false,
        mealCount: 2,
      }));
    }
  };

  const handleUpdateSettings = (newSettings: Partial<AdditionalCostSettings>) => {
    setAdditionalSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleReset = () => {
    setPeople({ adult: 2, senior: 0, teen: 0, child: 0 });
    setCaves(INITIAL_CAVE_DATA);
    setAttractions(OPTIONAL_ATTRACTIONS);
    setSelectedCourseId('dayTrip');
    setAdditionalSettings({
      includeMeals: true,
      mealCostPerPerson: 15000,
      mealCount: 2,
      includeStay: false,
      stayCost: 150000,
      fuelAndToll: 20000,
    });
  };

  // Calculations
  const settlement = useMemo(() => {
    return calculateSettlement(people, caves, attractions, additionalSettings);
  }, [people, caves, attractions, additionalSettings]);

  const currentCourse = useMemo(() => {
    return ITINERARY_COURSES.find((c) => c.id === selectedCourseId) || ITINERARY_COURSES[0];
  }, [selectedCourseId]);

  const shareText = useMemo(() => {
    return generateKakaoShareText(people, settlement, currentCourse.title);
  }, [people, settlement, currentCourse]);

  return (
    <div
      className={`min-h-screen bg-stone-100/90 text-stone-900 pb-28 ${
        isLargeFont ? 'text-lg' : 'text-base'
      }`}
    >
      {/* 1. Header with Senior Font Mode & Reset */}
      <Header
        isLargeFont={isLargeFont}
        onToggleFontSize={() => setIsLargeFont(!isLargeFont)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-3.5 sm:px-4 py-4 sm:py-6 space-y-5">
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-1">
            <span>충북 단양군 공식 관광 정보 기반</span>
            <span>·</span>
            <span>2026 최신 요금 적용</span>
          </div>
          <h2 className={`font-black tracking-tight text-white ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
            단양 동굴 여행 비용 계산 & 맞춤 코스
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
            인원수만 콕콕 누르면 고수동굴·온달동굴 입장료와 체험비가 1초 만에 자동 계산되며,
            당일치기 및 1박 2일 지질 명소 동선과 카카오톡 정산서를 제공합니다.
          </p>
        </div>

        {/* 1. 인원 선택 */}
        <PeopleCounter
          people={people}
          onChange={handlePeopleChange}
          isLargeFont={isLargeFont}
        />

        {/* 2. 동굴 입장료 & 체험비 선택 */}
        <CaveSelection
          caves={caves}
          people={people}
          onToggleCave={handleToggleCave}
          onToggleExperience={handleToggleExperience}
          isLargeFont={isLargeFont}
        />

        {/* 3. 필수 지질 명소 동선 추천 */}
        <CourseRecommendation
          selectedCourseId={selectedCourseId}
          onSelectCourse={handleCourseSelect}
          isLargeFont={isLargeFont}
        />

        {/* 4. 기타 명소 및 실비 정산 옵션 */}
        <AdditionalExpenses
          attractions={attractions}
          people={people}
          settings={additionalSettings}
          onToggleAttraction={handleToggleAttraction}
          onUpdateSettings={handleUpdateSettings}
          isLargeFont={isLargeFont}
        />

        {/* 어르신 안심 관람 가이드 & 수칙 */}
        <SeniorGuideTips isLargeFont={isLargeFont} />

        {/* 5. 최종 비용 정산서 & 영수증 카드 */}
        <SettlementSummary
          settlement={settlement}
          people={people}
          onOpenKakaoModal={() => setIsKakaoModalOpen(true)}
          isLargeFont={isLargeFont}
        />
      </main>

      {/* 카카오톡 공유 모달 */}
      <KakaoShareModal
        isOpen={isKakaoModalOpen}
        onClose={() => setIsKakaoModalOpen(false)}
        shareText={shareText}
        settlement={settlement}
        courseTitle={currentCourse.title}
        people={people}
        isLargeFont={isLargeFont}
      />
    </div>
  );
}
