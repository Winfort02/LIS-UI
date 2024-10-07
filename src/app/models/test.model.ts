import { ITest } from '../interfaces/test.interface';
import { Hematology } from './hematology.model';
import { Patient } from './patient.model';
import { Urinalysis } from './urinalysis.model';

export class Test implements ITest {
  id?: number | undefined;
  patient_id!: number;
  patient?: Patient | undefined;
  type!: string;
  transaction_number!: string;
  hematology?: Hematology | undefined;
  urinalysis?: Urinalysis | undefined;
  createdAt?: Date | undefined;
}
