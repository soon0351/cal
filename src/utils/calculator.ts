import {
  PeopleCount,
  CaveSite,
  OptionalAttraction,
  AdditionalCostSettings,
} from '../types/travel';

export interface SettlementDetail {
  totalPeople: number;
  gosuAdmissionTotal: number;
  gosuExpTotal: number;
  gosuSubtotal: number;
  ondalAdmissionTotal: number;
  ondalExpTotal: number;
  ondalSubtotal: number;
  optionalAttractionsTotal: number;
  parkingTotal: number;
  mealsTotal: number;
  stayTotal: number;
  fuelTotal: number;
  grandTotal: number;
  perPersonCost: number;
  breakdownItems: {
    category: string;
    label: string;
    amount: number;
    details: string;
  }[];
}

export function calculateSettlement(
  people: PeopleCount,
  caves: CaveSite[],
  optionalAttractions: OptionalAttraction[],
  additionalSettings: AdditionalCostSettings
): SettlementDetail {
  const totalPeople = people.adult + people.senior + people.teen + people.child;
  const payingAdultEquiv = Math.max(1, totalPeople);

  let gosuAdmissionTotal = 0;
  let gosuExpTotal = 0;
  let gosuSubtotal = 0;

  let ondalAdmissionTotal = 0;
  let ondalExpTotal = 0;
  let ondalSubtotal = 0;

  let optionalAttractionsTotal = 0;
  let parkingTotal = 0;

  const breakdownItems: SettlementDetail['breakdownItems'] = [];

  // 1. Caves
  caves.forEach((cave) => {
    if (!cave.selected) return;

    const adultFee = cave.basePrices.adult * people.adult;
    const seniorFee = cave.basePrices.senior * people.senior;
    const teenFee = cave.basePrices.teen * people.teen;
    const childFee = cave.basePrices.child * people.child;
    const admissionSum = adultFee + seniorFee + teenFee + childFee;

    let expSum = 0;
    const expDetails: string[] = [];

    cave.experiences.forEach((exp) => {
      if (exp.selected) {
        // Experience cost applies to total people unless specified
        const expAmount = exp.pricePerPerson * totalPeople;
        expSum += expAmount;
        expDetails.push(`${exp.name} (${(exp.pricePerPerson).toLocaleString()}원 × ${totalPeople}명)`);
      }
    });

    if (cave.parkingFee > 0 && totalPeople > 0) {
      parkingTotal += cave.parkingFee;
    }

    if (cave.id === 'gosu') {
      gosuAdmissionTotal = admissionSum;
      gosuExpTotal = expSum;
      gosuSubtotal = admissionSum + expSum;
      breakdownItems.push({
        category: '동굴 입장료',
        label: '고수동굴 입장료',
        amount: admissionSum,
        details: `성인(${people.adult})·경로(${people.senior})·청소년(${people.teen})·어린이(${people.child})`,
      });
      if (expSum > 0) {
        breakdownItems.push({
          category: '동굴 체험비',
          label: '고수동굴 체험비',
          amount: expSum,
          details: expDetails.join(', '),
        });
      }
    } else if (cave.id === 'ondal') {
      ondalAdmissionTotal = admissionSum;
      ondalExpTotal = expSum;
      ondalSubtotal = admissionSum + expSum;
      breakdownItems.push({
        category: '동굴 입장료',
        label: '온달관광지 & 온달동굴 입장료',
        amount: admissionSum,
        details: `성인(${people.adult})·경로(${people.senior})·청소년(${people.teen})·어린이(${people.child})`,
      });
      if (expSum > 0) {
        breakdownItems.push({
          category: '동굴 체험비',
          label: '온달관광지 체험비',
          amount: expSum,
          details: expDetails.join(', '),
        });
      }
    }
  });

  // 2. Optional Attractions
  optionalAttractions.forEach((spot) => {
    if (spot.selected) {
      const adultAmt = spot.prices.adult * people.adult;
      const seniorAmt = spot.prices.senior * people.senior;
      const teenAmt = spot.prices.teen * people.teen;
      const childAmt = spot.prices.child * people.child;
      const spotSum = adultAmt + seniorAmt + teenAmt + childAmt;

      if (spotSum > 0) {
        optionalAttractionsTotal += spotSum;
        breakdownItems.push({
          category: '선택 명소',
          label: spot.name,
          amount: spotSum,
          details: `입장료 (${totalPeople}명)`,
        });
      }
      if (spot.parkingFee > 0 && totalPeople > 0) {
        parkingTotal += spot.parkingFee;
      }
    }
  });

  if (parkingTotal > 0) {
    breakdownItems.push({
      category: '주차비',
      label: '유료 주차장 요금 합산',
      amount: parkingTotal,
      details: '승용차 기준 (고수동굴, 도담삼봉 등)',
    });
  }

  // 3. Meals
  let mealsTotal = 0;
  if (additionalSettings.includeMeals && totalPeople > 0) {
    mealsTotal = additionalSettings.mealCostPerPerson * totalPeople * additionalSettings.mealCount;
    breakdownItems.push({
      category: '식사/간식비',
      label: `식비 (${additionalSettings.mealCount}끼 기준)`,
      amount: mealsTotal,
      details: `1인당 ${additionalSettings.mealCostPerPerson.toLocaleString()}원 × ${totalPeople}명 × ${additionalSettings.mealCount}식`,
    });
  }

  // 4. Stay
  let stayTotal = 0;
  if (additionalSettings.includeStay && totalPeople > 0) {
    stayTotal = additionalSettings.stayCost;
    breakdownItems.push({
      category: '숙박비',
      label: '1박 숙소 비용',
      amount: stayTotal,
      details: '단양 리조트 / 펜션 1실 기준',
    });
  }

  // 5. Fuel & Toll
  const fuelTotal = additionalSettings.fuelAndToll || 0;
  if (fuelTotal > 0 && totalPeople > 0) {
    breakdownItems.push({
      category: '교통/유류비',
      label: '차량 유류비 & 톨게이트비',
      amount: fuelTotal,
      details: '공동 차량 경비',
    });
  }

  const grandTotal =
    gosuSubtotal +
    ondalSubtotal +
    optionalAttractionsTotal +
    parkingTotal +
    mealsTotal +
    stayTotal +
    fuelTotal;

  const perPersonCost = totalPeople > 0 ? Math.round(grandTotal / totalPeople) : 0;

  return {
    totalPeople,
    gosuAdmissionTotal,
    gosuExpTotal,
    gosuSubtotal,
    ondalAdmissionTotal,
    ondalExpTotal,
    ondalSubtotal,
    optionalAttractionsTotal,
    parkingTotal,
    mealsTotal,
    stayTotal,
    fuelTotal,
    grandTotal,
    perPersonCost,
    breakdownItems,
  };
}

export function generateKakaoShareText(
  people: PeopleCount,
  settlement: SettlementDetail,
  courseTitle: string
): string {
  const lines: string[] = [
    '🦇 [단양 동굴 & 지질 명소 여행 정산서] 🦇',
    `🗓️ 추천 코스: ${courseTitle}`,
    `👥 여행 인원: 총 ${settlement.totalPeople}명 (성인 ${people.adult}명, 경로 ${people.senior}명, 청소년 ${people.teen}명, 어린이 ${people.child}명)`,
    '──────────────────',
    `💰 총 여행 경비: ${settlement.grandTotal.toLocaleString()}원`,
    `👉 1인당(1/N) 분담금: ${settlement.perPersonCost.toLocaleString()}원`,
    '──────────────────',
    '📌 [주요 항목별 정산 내역]',
  ];

  if (settlement.gosuSubtotal > 0) {
    lines.push(`• 고수동굴 합계: ${settlement.gosuSubtotal.toLocaleString()}원 (입장료 ${settlement.gosuAdmissionTotal.toLocaleString()}원 + 체험 ${settlement.gosuExpTotal.toLocaleString()}원)`);
  }
  if (settlement.ondalSubtotal > 0) {
    lines.push(`• 온달관광지 합계: ${settlement.ondalSubtotal.toLocaleString()}원 (입장료 ${settlement.ondalAdmissionTotal.toLocaleString()}원 + 체험 ${settlement.ondalExpTotal.toLocaleString()}원)`);
  }
  if (settlement.optionalAttractionsTotal > 0) {
    lines.push(`• 기타 지질명소: ${settlement.optionalAttractionsTotal.toLocaleString()}원`);
  }
  if (settlement.parkingTotal > 0) {
    lines.push(`• 주차비 합산: ${settlement.parkingTotal.toLocaleString()}원`);
  }
  if (settlement.mealsTotal > 0) {
    lines.push(`• 식사 및 간식비: ${settlement.mealsTotal.toLocaleString()}원`);
  }
  if (settlement.stayTotal > 0) {
    lines.push(`• 숙박비: ${settlement.stayTotal.toLocaleString()}원`);
  }
  if (settlement.fuelTotal > 0) {
    lines.push(`• 유류비 및 도로비: ${settlement.fuelTotal.toLocaleString()}원`);
  }

  lines.push('──────────────────');
  lines.push('✨ 안전하고 건강한 단양 지질 여행 되세요! ✨');
  lines.push('단양 동굴 비용 계산기 & 코스 추천 웹앱');

  return lines.join('\n');
}
