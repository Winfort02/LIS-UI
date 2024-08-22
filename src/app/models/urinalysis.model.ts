import { IResultTypeUrinalysis } from '../interfaces/urinalysis.interface';
import { Patient } from './patient.model';

export class ResultTypeUrinalysis implements IResultTypeUrinalysis {
  id?: number | undefined;
  patient!: Patient;
  patient_id!: number;
  remarks!: string;
}
