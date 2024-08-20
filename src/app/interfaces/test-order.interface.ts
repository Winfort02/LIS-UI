import { IPatient } from './patient.interface';

export interface ITestOrder {
  id?: number;
  test_type: string;
  specify_test: string;
  sample: string;
  patient: IPatient;
  patient_id: number;
  collection_date_time: Date;
}
