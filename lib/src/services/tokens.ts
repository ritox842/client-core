import { InjectionToken } from '@angular/core';

export interface Translate {
  transform(value, interpolateParams?): string;
}

export const APP_TRANSLATE = new InjectionToken<Translate>('APP_TRANSLATE');
