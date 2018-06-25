/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { SnackbarType } from '../snackbar/snackbar.types';
import { DatoTranslateService } from '../services/translate.service';
import { ContentRef, createComponent, ngContentResolver } from '../angular/dynamic-components';
import { DatoSnackbarComponent } from './snackbar.component';
import { DOCUMENT } from '@angular/common';
import { getDefaults, SnackbarOptions } from './snackbar.types';
import { SnackbarRef } from './snackbar-ref';
import { isString } from '@datorama/utils';
import { ContentType } from '../dynamic-content/dynamic-content.types';
import { take } from 'rxjs/operators';

@Injectable()
export class DatoSnackbar {
  private contentRef: ContentRef;
  private component: ComponentRef<any>;
  private nativeElement: HTMLElement;

  constructor(private translate: DatoTranslateService, private appRef: ApplicationRef, private resolver: ComponentFactoryResolver, private injector: Injector, @Inject(DOCUMENT) private document) {}

  /**
   *
   * @param {string | TemplateRef<any>} content
   * @param {SnackbarType} type
   * @param {Partial<SnackbarOptions>} options
   * @returns {SnackbarRef}
   */
  snack(content: ContentType, type: SnackbarType = SnackbarType.INFO, options: Partial<SnackbarOptions> = {}) {
    this.destroy();
    const mergedOptions = { ...getDefaults(), ...options };

    this.contentRef = ngContentResolver({
      applicationRef: this.appRef,
      injector: this.injector,
      resolver: this.resolver,
      content: isString(content) ? this.translate.transform(content) : content
    });

    this.component = createComponent<DatoSnackbarComponent>({
      component: DatoSnackbarComponent,
      projectableNodes: this.contentRef.nodes,
      injector: this.injector,
      resolver: this.resolver
    });

    const { instance, changeDetectorRef, location: { nativeElement } } = this.component;
    this.nativeElement = nativeElement;

    const snackbarRef = new SnackbarRef();
    snackbarRef.afterDismissed = instance.close;

    instance.options = mergedOptions;
    instance.type = type;
    instance.close.pipe(take(1)).subscribe(() => {
      this.destroy();
    });

    changeDetectorRef.detectChanges();

    this.document.body.appendChild(nativeElement);

    return snackbarRef;
  }

  /**
   *
   * @param {ContentType} msg
   */
  info(msg: ContentType, options: Partial<SnackbarOptions> = {}) {
    return this.snack(msg, SnackbarType.INFO, options);
  }

  /**
   *
   * @param {ContentType} msg
   */
  success(msg: ContentType, options: Partial<SnackbarOptions> = {}) {
    return this.snack(msg, SnackbarType.SUCCESS, options);
  }

  /**
   *
   * @param {ContentType} msg
   */
  error(msg: ContentType, options: Partial<SnackbarOptions> = {}) {
    return this.snack(msg, SnackbarType.ERROR, options);
  }

  /**
   *
   * @param {ContentType} msg
   */
  dramaticSuccess(msg: ContentType, options: Partial<SnackbarOptions> = {}) {
    return this.snack(msg, SnackbarType.DRAMATIC_SUCCESS, options);
  }

  /**
   *
   * @param {ContentType} msg
   */
  dramaticError(msg: ContentType, options: Partial<SnackbarOptions> = {}) {
    return this.snack(msg, SnackbarType.DRAMATIC_ERROR, options);
  }

  private destroy() {
    if (this.nativeElement) {
      this.contentRef.destroy(this.appRef);
      this.component.destroy();
      this.document.body.removeChild(this.nativeElement);
      this.nativeElement = null;
    }
  }
}
