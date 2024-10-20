import {
  ChemicalTestDropdown,
  STOCK_SELECTION_MODE,
  TestType,
  Unit,
} from '../enums/common.enum';
import { IDropdownOption } from '../interfaces/dropdown-option.interface';

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

export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female',
  Other: 'Other',
};

export const CHEMICAL_TEST_DROPDOWN_COMMON: IDropdownOption[] = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: ChemicalTestDropdown.NEGATIVE,
    value: ChemicalTestDropdown.NEGATIVE,
  },
  {
    label: ChemicalTestDropdown.ONE_PLUS,
    value: ChemicalTestDropdown.ONE_PLUS,
  },
  {
    label: ChemicalTestDropdown.TWO_PLUS,
    value: ChemicalTestDropdown.TWO_PLUS,
  },
  {
    label: ChemicalTestDropdown.THREE_PLUS,
    value: ChemicalTestDropdown.THREE_PLUS,
  },
  {
    label: ChemicalTestDropdown.FOUR_PLUS,
    value: ChemicalTestDropdown.FOUR_PLUS,
  },
];

export const CHEMICAL_TEST_DROPDOWN_NITRE: IDropdownOption[] = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: ChemicalTestDropdown.NEGATIVE,
    value: ChemicalTestDropdown.NEGATIVE,
  },
  {
    label: ChemicalTestDropdown.POSITIVE,
    value: ChemicalTestDropdown.POSITIVE,
  },
];

export const CHEMICAL_TEST_DROPDOWN_WITH_TRACE: IDropdownOption[] = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: ChemicalTestDropdown.NEGATIVE,
    value: ChemicalTestDropdown.NEGATIVE,
  },
  {
    label: ChemicalTestDropdown.TRACE,
    value: ChemicalTestDropdown.TRACE,
  },
  {
    label: ChemicalTestDropdown.ONE_PLUS,
    value: ChemicalTestDropdown.ONE_PLUS,
  },
  {
    label: ChemicalTestDropdown.TWO_PLUS,
    value: ChemicalTestDropdown.TWO_PLUS,
  },
  {
    label: ChemicalTestDropdown.THREE_PLUS,
    value: ChemicalTestDropdown.THREE_PLUS,
  },
];

export const CHEMICAL_TEST_DROPDOWN_MAX_3PLUS: IDropdownOption[] = [
  {
    label: 'Select',
    value: '',
  },
  {
    label: ChemicalTestDropdown.NEGATIVE,
    value: ChemicalTestDropdown.NEGATIVE,
  },
  {
    label: ChemicalTestDropdown.ONE_PLUS,
    value: ChemicalTestDropdown.ONE_PLUS,
  },
  {
    label: ChemicalTestDropdown.TWO_PLUS,
    value: ChemicalTestDropdown.TWO_PLUS,
  },
  {
    label: ChemicalTestDropdown.THREE_PLUS,
    value: ChemicalTestDropdown.THREE_PLUS,
  },
];

export const CHEMICAL_TEST_DROPDOWN_PH: IDropdownOption[] = [
  {
    label: 'Select',
    value: 0.0,
  },
  {
    label: ChemicalTestDropdown.SIX,
    value: ChemicalTestDropdown.SIX,
  },
  {
    label: ChemicalTestDropdown.SIX_POINT_FIVE,
    value: ChemicalTestDropdown.SIX_POINT_FIVE,
  },
  {
    label: ChemicalTestDropdown.SEVEN,
    value: ChemicalTestDropdown.SEVEN,
  },
];

export const CHEMICAL_TEST_DROPDOWN_SPEC_GRAV: IDropdownOption[] = [
  {
    label: 'Select',
    value: 0.0,
  },
  {
    label: ChemicalTestDropdown.ONE_POINT_ZERO_ONE,
    value: ChemicalTestDropdown.ONE_POINT_ZERO_ONE,
  },
  {
    label: ChemicalTestDropdown.ONE_POINT_ZERO_FIFTEEN,
    value: ChemicalTestDropdown.ONE_POINT_ZERO_FIFTEEN,
  },
  {
    label: ChemicalTestDropdown.ONE_POINT_ZERO_TWO,
    value: ChemicalTestDropdown.ONE_POINT_ZERO_TWO,
  },
  {
    label: ChemicalTestDropdown.ONE_POINT_ZERO_TWOFIVE,
    value: ChemicalTestDropdown.ONE_POINT_ZERO_TWOFIVE,
  },
  {
    label: ChemicalTestDropdown.ONE_POINT_ZERO_THREE,
    value: ChemicalTestDropdown.ONE_POINT_ZERO_THREE,
  },
];
export const TEST_TYPE_DROPDOWN: IDropdownOption[] = [
  {
    label: TestType.hematology,
    value: TestType.hematology,
  },
  {
    label: TestType.urinalysis,
    value: TestType.urinalysis,
  },
  {
    label: TestType.chemistry,
    value: TestType.chemistry,
  },
];

export const APPARATUS_UNIT_DROPDOWN = [
  {
    label: Unit.PACKS,
    value: Unit.PACKS,
  },
  {
    label: Unit.BOTTLES,
    value: Unit.BOTTLES,
  },
  {
    label: Unit.BOX,
    value: Unit.BOX,
  },
  {
    label: Unit.TRAYS,
    value: Unit.TRAYS,
  },
  {
    label: Unit.PCS,
    value: Unit.PCS,
  },
];

export const STOCK_TYPE = [
  {
    label: 'STOCK OUT',
    value: STOCK_SELECTION_MODE.OUT,
  },
  {
    label: 'STOCK IN',
    value: STOCK_SELECTION_MODE.IN,
  },
];
