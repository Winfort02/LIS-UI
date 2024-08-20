import { IResultTypeHematology } from '../interfaces/hematology.interface';
import { Patient } from './patient.model';
import { TestOrder } from './test-order.model';

export class ResultTypeHematology implements IResultTypeHematology {
  id?: number | undefined;
  test_order!: TestOrder;
  test_order_id!: number;
  patient!: Patient;
  patient_id!: number;
  test_requested_hemoglobin!: number | null;
  test_requested_hematocrit!: number | null;
  test_requested_rbc_count!: number | null;
  test_requested_wbc_count!: number | null;
  test_requested_platelet_count!: number | null;
  test_requested_dc_neutrophil!: number | null;
  test_requested_segmented!: number | null;
  test_requested_dc_stab!: number | null;
  test_requested_dc_lymhocytes!: number | null;
  test_requested_monocytes!: number | null;
  test_requested_dc_eosinophils!: number | null;
  test_requested_dc_basophils!: number | null;
  test_requested_blood_typing_abo!: number | null;
  test_requested_blood_typing_rh!: number | null;
  date_of_result!: Date;
  remarks!: string;
}
