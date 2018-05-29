/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Pipe, PipeTransform } from '@angular/core';
import { DatoOptionDirective } from './select-option.directive';

@Pipe({
  name: 'selectFilter'
})
export class FilterPipe implements PipeTransform {
  transform(options: DatoOptionDirective[], internalSearch: boolean, isCombo: boolean, labelKey: string, value: string): any {
    if (!internalSearch || !isCombo || !value) {
      return options;
    }

    return options.filter((option: DatoOptionDirective) => {
      const regex = new RegExp(value, 'ig');
      return regex.test(option.option[labelKey]);
    });
  }
}
