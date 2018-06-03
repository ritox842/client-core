import { DatoSelectOptionComponent } from './select-option.component';

/**
 * DatoSelectSearchStrategy - Interface for custom search strategies
 */
export interface DatoSelectSearchStrategy {
  (datoOption: DatoSelectOptionComponent, searchValue: string, labelKey?: string): boolean;
}

/**
 * The default search stratrgy is compare lowercased strings
 * @param {DatoSelectOptionComponent} datoOption
 * @param {string} searchValue
 * @param {string} labelKey
 * @returns {boolean}
 */
export const defaultClientSearchStrategy: DatoSelectSearchStrategy = (datoOption: DatoSelectOptionComponent, searchValue: string, labelKey: string) => {
  return datoOption.option[labelKey].toLowerCase().indexOf(searchValue) > -1;
};
