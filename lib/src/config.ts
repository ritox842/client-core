import { InjectionToken, Type } from '@angular/core';

export type CoreConfig = {
  appSelector: string;
  sidenavSelector: string;
  sidenavComponents?: Type<any>[];
};

export const DATO_CORE_CONFIG = new InjectionToken<CoreConfig>('DATO_CORE_CONFIG');
