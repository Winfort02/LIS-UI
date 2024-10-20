import { ITest } from './test.interface';

export interface IChemistry {
  id?: number;
  test_id: number;
  test?: ITest;
  physician: string;
  lab_no: string;
  last_meal_take: Date;
  time_taken: Date;
  test_requested: string;
  fasting_blood_sugar: number;
  random_blood_sugar: number;
  post_prandial: number;
  total_cholesterol: number;
  triglycerides: number;
  hdl: number;
  ldl: number;
  uric_acid: number;
  creatinine: number;
  bun: number;
  sgpt: number;
  sgot: number;
  sodium: number;
  potasium: number;
  ionized_calcium: number;
  magnesium: number;
  calcium: number;
  remarks: string;
  createdAt?: Date;
}
