/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Observable } from 'rxjs/Observable';
import { isNumber } from '@datorama/utils';
import { timer } from 'rxjs/observable/timer';
import { concatMapTo } from 'rxjs/operators';

/**
 *
 * @param stream - Rx Stream
 * @param period - The period of time between emissions of the subsequent numbers.
 * @param initialDelay - The initial delay time to wait before emitting the first value of 0.
 */
export function polling(stream: Observable<any>, period: number, initialDelay = 0) {
  if (!isNumber(period) || !isNumber(initialDelay)) {
    throw 'period/initialDelay should be a number';
  }

  return timer(initialDelay, period).pipe(concatMapTo(stream));
}
