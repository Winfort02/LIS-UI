export interface IPatient {
  id?: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  contact_number: string;
  date_of_birth: Date;
  sex: string;
  address: string;
  civil_status: string;
  createdAt?: Date;
}
