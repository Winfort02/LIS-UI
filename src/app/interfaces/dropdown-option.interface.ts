import { ChemicalTestDropdown } from '../enums/common.enum';

export interface IDropdownOption {
  label: string | ChemicalTestDropdown;
  value: string | number | ChemicalTestDropdown;
}
