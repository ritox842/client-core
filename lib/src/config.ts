import { InjectionToken } from '@angular/core';

export type CoreConfig = {
  appSelector: string;
  sidenavSelector: string;
  paths: {
    editor: string;
    richText: string;
  };
};

export const DATO_CORE_CONFIG = new InjectionToken<CoreConfig>('DATO_CORE_CONFIG');
