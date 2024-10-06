import { IHematology } from '../interfaces/hematology.interface';
import { ITest } from '../interfaces/test.interface';

export class Hematology implements IHematology {
  id?: number | undefined;
  test_id!: number;
  test?: ITest | undefined;
  physician!: string;
  lab_no!: string;
  hemoglobin!: number;
  hematocrit!: number;
  rbc_count!: number;
  wbc_count!: number;
  platelet_count!: number;
  mcv!: number;
  mch!: number;
  mchc!: number;
  rdw_cv!: number;
  mpv!: number;
  pdw!: number;
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
