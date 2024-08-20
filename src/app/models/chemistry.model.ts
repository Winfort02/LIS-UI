import { IResultTypeChemistry } from '../interfaces/chemistry.interface';
import { IPatient } from '../interfaces/patient.interface';
import { ITestOrder } from '../interfaces/test-order.interface';

export class ResultTypeChemistry implements IResultTypeChemistry {
  id?: number | undefined;
  test_order!: ITestOrder;
  test_order_id!: number;
  patient!: IPatient;
  patient_id!: number;
  last_meal?: number | undefined;
  time_taken?: number | undefined;
  blood_sugar_fasting?: number | undefined;
  blood_sugar_random?: number | undefined;
  blood_sugar_2hr_post?: number | undefined;
  prandial?: string | undefined;
  lipid_profile_total_choresterol?: number | undefined;
  lipid_profile_triglycerides?: number | undefined;
  lipid_profile_hdl?: number | undefined;
  kidney_ft_uric_acid?: number | undefined;
  kidney_ft_creatine?: number | undefined;
  kidney_ft_bun?: number | undefined;
  enzymes_sgpt?: number | undefined;
  enzymes_sgot?: number | undefined;
  electrolytes_sodium?: number | undefined;
  electrolytes_potassium?: number | undefined;
  electrolytes_calcium?: number | undefined;
  date_of_result!: Date;
  remarks!: string;
}
