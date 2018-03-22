/**
 * @license
 * Copyright Datorama LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license.
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
