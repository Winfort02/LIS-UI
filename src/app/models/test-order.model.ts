import { IPatient } from '../interfaces/patient.interface';
import { ITestOrder } from '../interfaces/test-order.interface';

export class TestOrder implements ITestOrder {
  id?: number | undefined;
  test_type!: string;
  specify_test!: string;
  sample!: string;
  patient!: IPatient;
  patient_id!: number;
  collection_date_time!: Date;
}
