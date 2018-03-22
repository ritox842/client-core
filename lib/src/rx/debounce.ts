/**
 * @license
 * Copyright Datorama LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license.
 */

import { Observable } from 'rxjs/Observable';
import { toBoolean } from '@datorama/utils';
import { debounceTime } from 'rxjs/operators';

/**
 * Add debounce optionally. If you don't pass a value, you will not trigger debounce
 * @param time - debounce time
 * @returns {(source: Observable<T>) => Observable<T>}
 */
export function optionalDebounce<T>(time = undefined): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    if (toBoolean(time)) {
      return source.pipe(debounceTime(time));
    }
    
    return source;
  };
}
