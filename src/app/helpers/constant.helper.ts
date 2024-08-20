export const FIELD_VALIDATIONS = {
  NAME: /^[A-Za-z]+( [A-Za-z]+)*$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]*$/,
  PHONE: /^(?:\+639|09)\d{9}$/,
};

export const STATUS_OPTON = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Widowed', value: 'Widowed' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Separated', value: 'Separated' },
];

export const MESSAGES = {
  CREATED_PATIENT: 'New Patient added successfully',
  UPDATED_PATIENT: 'Patient details updated successfully',
};
