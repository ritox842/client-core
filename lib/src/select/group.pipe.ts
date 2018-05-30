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
  name: 'groupFilter'
})
export class GroupFilterPipe implements PipeTransform {
  transform(options: DatoOptionDirective[], internalSearch: boolean, isCombo: boolean, groupByKey: string, value: string): any {
    if (!options) return [];

    const result = options.reduce((acc, datoOption: DatoOptionDirective) => {
      const group = acc.find(current => current[groupByKey] === datoOption.option[groupByKey]);

      if (!group) {
        acc.push({
          [groupByKey]: datoOption.option.group,
          children: [datoOption]
        });
      } else {
        group.children.push(datoOption);
      }
      return acc;
    }, []);

    console.log(result);
    return result;
  }
}
