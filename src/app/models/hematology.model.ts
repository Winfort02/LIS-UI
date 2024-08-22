import { IHematology } from '../interfaces/hematology.interface';
import { IPatient } from '../interfaces/patient.interface';

export class Hematology implements IHematology {
  id?: number | undefined;
  patient_id!: number;
  patient?: IPatient | undefined;
  physician!: string;
  lab_no!: number;
  hemoglobin!: number;
  hematocrit!: number;
  rbc_count!: number;
  wbc_count!: number;
  platelet_count!: number;
  neutrophil!: number;
  segmented!: number;
  stab!: number;
  lymphocyties!: number;
  monocyties!: number;
  eosinophils!: number;
  basophils!: number;
  createdAt?: Date | undefined;
  remarks!: string;
}
