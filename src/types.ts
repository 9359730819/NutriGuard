export type Gender = 'male' | 'female';
export type AreaType = 'Rural' | 'Urban';
export type NutritionStatus = 'Normal' | 'MAM' | 'SAM';

export interface ChildRecord {
  id: string;
  name: string;
  ageMonths: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  muacCm: number;
  status: NutritionStatus;
  zScore: number;
  schoolId: string;
  areaType: AreaType;
  timestamp: string;
}

export interface School {
  id: string;
  name: string;
  district: string;
  areaType: AreaType;
}
