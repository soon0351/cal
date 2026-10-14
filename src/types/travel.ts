export interface PeopleCount {
  adult: number;      // 성인 (만 19세~64세)
  senior: number;     // 경로 (만 65세 이상)
  teen: number;       // 청소년 (중·고등학생)
  child: number;      // 어린이 (만 4세~초등학생)
}

export interface CaveExperience {
  id: string;
  name: string;
  pricePerPerson: number;
  description: string;
  target?: 'all' | 'child_teen' | 'per_group';
  selected: boolean;
}

export interface CaveSite {
  id: 'gosu' | 'ondal';
  name: string;
  koreanTitle: string;
  tagline: string;
  selected: boolean;
  basePrices: {
    adult: number;
    senior: number;
    teen: number;
    child: number;
  };
  experiences: CaveExperience[];
  features: string[];
  seniorCaution: string;
  stairsCount: string;
  duration: string;
  temperature: string;
  parkingFee: number;
}

export interface OptionalAttraction {
  id: string;
  name: string;
  category: 'geology' | 'attraction' | 'food';
  prices: {
    adult: number;
    senior: number;
    teen: number;
    child: number;
  };
  parkingFee: number;
  selected: boolean;
  description: string;
  highlight: string;
}

export interface AdditionalCostSettings {
  includeMeals: boolean;
  mealCostPerPerson: number;
  mealCount: number;
  includeStay: boolean;
  stayCost: number;
  fuelAndToll: number;
}

export interface ItinerarySpot {
  time: string;
  title: string;
  subtitle: string;
  category: '동굴' | '지질명소' | '식도락' | '체험' | '숙소';
  geologicalSignificance: string; // 지질학적 의미
  seniorFriendlyTip: string;      // 어르신 배려 꿀팁
  duration: string;
  costEstimateKey?: string;
  mapQuery: string;
}

export interface ItineraryCourse {
  id: 'dayTrip' | 'overnight';
  title: string;
  badge: string;
  summary: string;
  totalDistance: string;
  totalTime: string;
  bestFor: string;
  days: {
    dayNumber: number;
    dayTitle: string;
    spots: ItinerarySpot[];
  }[];
}
