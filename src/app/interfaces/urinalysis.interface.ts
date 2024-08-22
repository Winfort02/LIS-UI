import { IPatient } from './patient.interface';

export interface IResultTypeUrinalysis {
  id?: number;
  patient: IPatient;
  patient_id: number;
  remarks: string;
}
