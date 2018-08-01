/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { DatoOptionComponent } from '../options/option.component';

/**
 * DatoSelectSearchStrategy - Interface for custom search strategies
 */
export interface DatoSelectSearchStrategy {
  (datoOption: DatoOptionComponent, searchValue: string, labelKey?: string): boolean;
}

/**
 * The default search stratrgy is compare lowercased strings
 * @param {DatoOptionComponent} datoOption
 * @param {string} searchValue
 * @param {string} labelKey
 * @returns {boolean}
 */
export const defaultClientSearchStrategy: DatoSelectSearchStrategy = (datoOption: DatoOptionComponent, searchValue: string, labelKey: string) => {
  return datoOption.option[labelKey].toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
};
