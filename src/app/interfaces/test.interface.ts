import { Hematology } from '../models/hematology.model';
import { Patient } from '../models/patient.model';

export interface ITest {
  id?: number;
  patient_id: number;
  patient?: Patient;
  type: string;
  transaction_number: string;
  hematology?: Hematology;
  createdAt?: Date;
}
