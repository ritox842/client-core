/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { InjectionToken, Injector } from '@angular/core';
import * as tokens from './tokens';

export enum MockService {
  TRANSLATE = 'translate'
}

export const mocks = {
  translate: {
    transform(value) {
      return value;
    }
  }
};

/**
 *
 * @param {MockService} service
 * @param {InjectionToken} token
 * @param {Injector} injector
 * @returns {any}
 */
export function mockInDev(service: MockService, token: InjectionToken<any>, injector: Injector) {
  const inDev = (window as any).datoDevMode;
  if (inDev) {
    return mocks[service];
  }
  return injector.get(token);
}

export const stubs = {
  translate() {
    return { provide: tokens.APP_TRANSLATE, useValue: mocks.translate };
  }
};
