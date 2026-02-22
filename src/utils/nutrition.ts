import { NutritionStatus } from '../types';

/**
 * Simplified Z-score calculation for prototype.
 * In a real app, this would use WHO reference tables (L, M, S values).
 * Here we use a simplified linear approximation for Weight-for-Height.
 */
export function calculateNutritionStatus(
  heightCm: number,
  weightKg: number,
  muacCm: number
): { status: NutritionStatus; zScore: number } {
  // Very simplified WFH approximation:
  // Expected weight (kg) approx = (height - 100) * 0.9 (very rough)
  // Let's use a slightly better mock formula for the prototype
  const expectedWeight = (heightCm - 50) * 0.3 + 3; 
  const standardDeviation = expectedWeight * 0.12;
  
  const zScore = (weightKg - expectedWeight) / standardDeviation;

  let status: NutritionStatus = 'Normal';

  // MUAC takes precedence for SAM/MAM detection
  if (muacCm < 11.5 || zScore < -3) {
    status = 'SAM';
  } else if ((muacCm >= 11.5 && muacCm < 12.5) || (zScore >= -3 && zScore < -2)) {
    status = 'MAM';
  }

  return { status, zScore: parseFloat(zScore.toFixed(2)) };
}

export const MOCK_SCHOOLS = [
  { id: 'S1', name: 'Anganwadi Center A', district: 'Central', areaType: 'Urban' },
  { id: 'S2', name: 'Anganwadi Center B', district: 'Central', areaType: 'Rural' },
  { id: 'S3', name: 'Primary School C', district: 'North', areaType: 'Rural' },
  { id: 'S4', name: 'Primary School D', district: 'South', areaType: 'Urban' },
];

export const MOCK_RECORDS: any[] = [
  { id: '1', name: 'Aarav Kumar', ageMonths: 24, gender: 'male', heightCm: 85, weightKg: 10.5, muacCm: 13.5, status: 'Normal', zScore: -0.5, schoolId: 'S1', areaType: 'Urban', timestamp: '2023-10-01' },
  { id: '2', name: 'Ananya Singh', ageMonths: 36, gender: 'female', heightCm: 92, weightKg: 9.2, muacCm: 11.2, status: 'SAM', zScore: -3.2, schoolId: 'S1', areaType: 'Urban', timestamp: '2023-10-05' },
  { id: '3', name: 'Vihaan Sharma', ageMonths: 18, gender: 'male', heightCm: 78, weightKg: 8.5, muacCm: 12.1, status: 'MAM', zScore: -2.1, schoolId: 'S2', areaType: 'Rural', timestamp: '2023-11-10' },
  { id: '4', name: 'Ishani Gupta', ageMonths: 48, gender: 'female', heightCm: 102, weightKg: 15.0, muacCm: 14.2, status: 'Normal', zScore: 0.2, schoolId: 'S2', areaType: 'Rural', timestamp: '2023-11-15' },
  { id: '5', name: 'Aditya Patel', ageMonths: 12, gender: 'male', heightCm: 72, weightKg: 6.8, muacCm: 11.4, status: 'SAM', zScore: -3.5, schoolId: 'S3', areaType: 'Rural', timestamp: '2023-12-01' },
  { id: '6', name: 'Saanvi Reddy', ageMonths: 30, gender: 'female', heightCm: 88, weightKg: 11.0, muacCm: 12.8, status: 'Normal', zScore: -1.2, schoolId: 'S3', areaType: 'Rural', timestamp: '2023-12-20' },
  { id: '7', name: 'Reyansh Das', ageMonths: 42, gender: 'male', heightCm: 98, weightKg: 10.5, muacCm: 11.8, status: 'MAM', zScore: -2.8, schoolId: 'S4', areaType: 'Urban', timestamp: '2024-01-05' },
  { id: '8', name: 'Myra Khan', ageMonths: 54, gender: 'female', heightCm: 108, weightKg: 18.2, muacCm: 15.5, status: 'Normal', zScore: 0.8, schoolId: 'S4', areaType: 'Urban', timestamp: '2024-01-25' },
];
