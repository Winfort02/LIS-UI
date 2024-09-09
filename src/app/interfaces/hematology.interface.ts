import { IPatient } from './patient.interface';

export interface IHematology {
  id?: number;
  patient_id: number;
  patient?: IPatient;
  physician: string;
  lab_no: string;
  hemoglobin: number;
  hematocrit: number;
  rbc_count: number;
  wbc_count: number;
  platelet_count: number;
  neutrophil: number;
  segmented: number;
  stab: number;
  lymphocyties: number;
  monocyties: number;
  eosinophils: number;
  basophils: number;
  createdAt?: Date;
  remarks: string;
}
