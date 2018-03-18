import { Injectable, Injector } from '@angular/core';
import { APP_TRANSLATE, Translate } from './tokens';
import { mockInDev, MockService } from './utils';

@Injectable()
export class DatoTranslateService {
  private delegate: Translate;

  constructor(private injector: Injector) {
    this.delegate = mockInDev(MockService.TRANSLATE, APP_TRANSLATE, injector);
  }

  /**
   *
   * @param value
   * @param interpolateParams
   * @returns {string}
   */
  transform(value, interpolateParams?): string {
    return this.delegate.transform(value, interpolateParams);
  }
}
