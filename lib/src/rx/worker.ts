/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Observable } from 'rxjs';

/**
 *
 * @param fn
 * @returns {Worker}
 * @private
 */
function createWorker(fn) {
  const blob = new Blob([`self.cb = ${fn};self.onmessage = function (e) { self.postMessage(self.cb(e.data)) }`], {
    type: 'text/javascript'
  });

  const url = URL.createObjectURL(blob);
  return new Worker(url);
}

/**
 * Run a function inside web worker
 *
 * ```ts
 * http.get('url').pipe(
 *  mapWorker((response) => {
 *    // do some stuff
 *    return result;
 *  }).subcribe(console.log);
 * )
 *
 * ```
 * @param fn - the function to execute inside the worker
 */
export const workerMap = (fn: Function) => <T>(source: Observable<T>) =>
  new Observable(observer => {
    const worker = createWorker(fn);

    worker.onmessage = function(e) {
      observer.next(e.data);
      worker.terminate();
    };

    worker.onerror = function(error) {
      observer.error(error);
      worker.terminate();
    };

    return source.subscribe({
      next(value) {
        worker.postMessage(value);
      }
    });
  });
