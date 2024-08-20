import { IPatient } from '../interfaces/patient.interface';

export class Patient implements IPatient {
  id?: number | undefined;
  last_name!: string;
  first_name!: string;
  middle_name!: string;
  contact_number!: string;
  date_of_birth!: Date;
  sex!: string;
  address!: string;
  civil_status!: string;
  createdAt?: Date;
}
