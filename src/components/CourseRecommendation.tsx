import React, { useState } from 'react';
import { ITINERARY_COURSES } from '../data/danyangData';
import { ItineraryCourse, ItinerarySpot } from '../types/travel';
import {
  MapPin,
  Clock,
  Car,
  Compass,
  Navigation,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface CourseRecommendationProps {
  selectedCourseId: 'dayTrip' | 'overnight';
  onSelectCourse: (id: 'dayTrip' | 'overnight') => void;
  isLargeFont: boolean;
}

export const CourseRecommendation: React.FC<CourseRecommendationProps> = ({
  selectedCourseId,
  onSelectCourse,
  isLargeFont,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const currentCourse: ItineraryCourse =
    ITINERARY_COURSES.find((c) => c.id === selectedCourseId) || ITINERARY_COURSES[0];

  const handleCourseChange = (id: 'dayTrip' | 'overnight') => {
    onSelectCourse(id);
    setActiveDayIndex(0);
  };

  const currentDay = currentCourse.days[activeDayIndex] || currentCourse.days[0];

  const getCategoryColor = (category: ItinerarySpot['category']) => {
    switch (category) {
      case '동굴':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case '지질명소':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case '식도락':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case '체험':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '숙소':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`font-bold text-stone-900 ${isLargeFont ? 'text-xl' : 'text-base'}`}>
            3. 필수 지질 명소 동선 코스 추천
          </h2>
          <p className="text-xs text-stone-500">
            단양 세계지질공원 공인 코스로 안전하고 효율적인 이동 경로를 제공합니다
          </p>
        </div>
      </div>

      {/* Senior-friendly Big Course Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 rounded-xl">
        <button
          type="button"
          onClick={() => handleCourseChange('dayTrip')}
          className={`py-3.5 px-3 rounded-lg font-bold text-center transition-all flex flex-col items-center justify-center gap-1 ${
            selectedCourseId === 'dayTrip'
              ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-900'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900'
          }`}
        >
          <span className="text-xs opacity-90">당일 여행 추천</span>
          <span className={`leading-none ${isLargeFont ? 'text-lg' : 'text-base'}`}>
            🚗 당일치기 코스
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCourseChange('overnight')}
          className={`py-3.5 px-3 rounded-lg font-bold text-center transition-all flex flex-col items-center justify-center gap-1 ${
            selectedCourseId === 'overnight'
              ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-900'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900'
          }`}
        >
          <span className="text-xs opacity-90">어르신·가족 힐링</span>
          <span className={`leading-none ${isLargeFont ? 'text-lg' : 'text-base'}`}>
            🏨 1박 2일 코스
          </span>
        </button>
      </div>

      {/* Course Overview Card */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-200/80 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-200/80 text-emerald-900">
            {currentCourse.badge}
          </span>
          <div className="flex items-center gap-3 text-xs text-stone-600 font-semibold">
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-emerald-700" />
              {currentCourse.totalDistance}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              {currentCourse.totalTime}
            </span>
          </div>
        </div>

        <h3 className={`font-black text-emerald-950 ${isLargeFont ? 'text-xl' : 'text-lg'}`}>
          {currentCourse.title}
        </h3>
        <p className="text-xs text-stone-700 leading-relaxed">
          {currentCourse.summary}
        </p>

        <div className="text-xs text-emerald-900 font-medium pt-1 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>추천 대상:</strong> {currentCourse.bestFor}</span>
        </div>
      </div>

      {/* Day Tabs for 1박 2일 */}
      {currentCourse.days.length > 1 && (
        <div className="flex gap-2">
          {currentCourse.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setActiveDayIndex(idx)}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-sm border transition-all ${
                activeDayIndex === idx
                  ? 'bg-teal-700 text-white border-teal-800 shadow-sm'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {day.dayNumber}일차 동선 보기
            </button>
          ))}
        </div>
      )}

      {/* Timeline Spots */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-bold text-stone-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{currentDay.dayTitle}</span>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-emerald-300 ml-3 space-y-4">
          {currentDay.spots.map((spot, spotIdx) => (
            <div key={spotIdx} className="relative group">
              {/* Timeline circle node */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-4 ring-white">
                {spotIdx + 1}
              </div>

              {/* Spot Card */}
              <div className="bg-stone-50/90 border border-stone-200 rounded-xl p-3.5 sm:p-4 hover:border-emerald-300 transition-all space-y-2.5">
                {/* Spot Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {spot.time}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getCategoryColor(spot.category)}`}>
                      {spot.category}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    소요: {spot.duration}
                  </span>
                </div>

                <div>
                  <h4 className={`font-bold text-stone-900 ${isLargeFont ? 'text-lg' : 'text-base'}`}>
                    {spot.title}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {spot.subtitle}
                  </p>
                </div>

                {/* Geological Significance */}
                <div className="p-2.5 rounded-lg bg-white border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
                  <div className="font-bold text-emerald-900 flex items-center gap-1 mb-0.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>지질학적 관전 포인트:</span>
                  </div>
                  <p className="text-stone-600">{spot.geologicalSignificance}</p>
                </div>

                {/* Senior Friendly Tip */}
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                  <div className="font-bold text-amber-900 flex items-center gap-1 mb-0.5">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>어르신 배려 꿀팁:</span>
                  </div>
                  <p>{spot.seniorFriendlyTip}</p>
                </div>

                {/* Map Link */}
                <div className="flex justify-end pt-1">
                  <a
                    href={`https://map.kakao.com/?q=${encodeURIComponent(spot.mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>카카오맵 길찾기</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
