import { IPatient } from './patient.interface';
import { ITestOrder } from './test-order.interface';

export interface IResultTypeChemistry {
  id?: number;
  test_order: ITestOrder;
  test_order_id: number;
  patient: IPatient;
  patient_id: number;
  last_meal?: number;
  time_taken?: number;
  blood_sugar_fasting?: number;
  blood_sugar_random?: number;
  blood_sugar_2hr_post?: number;
  prandial?: string;
  lipid_profile_total_choresterol?: number;
  lipid_profile_triglycerides?: number;
  lipid_profile_hdl?: number;
  kidney_ft_uric_acid?: number;
  kidney_ft_creatine?: number;
  kidney_ft_bun?: number;
  enzymes_sgpt?: number;
  enzymes_sgot?: number;
  electrolytes_sodium?: number;
  electrolytes_potassium?: number;
  electrolytes_calcium?: number;
  date_of_result: Date;
  remarks: string;
}
