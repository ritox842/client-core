import { InjectionToken, Injector } from '@angular/core';

export enum MockService {
  TRANSLATE = 'translate'
}

const mocks = {
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
