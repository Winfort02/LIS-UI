import { Hematology } from '../models/hematology.model';
import { Patient } from '../models/patient.model';
import { Urinalysis } from '../models/urinalysis.model';

export interface ITest {
  id?: number;
  patient_id: number;
  patient?: Patient;
  type: string;
  transaction_number: string;
  hematology?: Hematology;
  urinalysis?: Urinalysis;
  createdAt?: Date;
}
