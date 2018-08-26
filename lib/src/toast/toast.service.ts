/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { DatoTranslateService } from '../services/translate.service';
import { ContentRef, createComponent, ngContentResolver } from '../angular/dynamic-components';
import { DatoToastComponent } from './toast.component';
import { DOCUMENT } from '@angular/common';
import { ToastRef } from './toast-ref';
import { isString } from '@datorama/utils';
import { ContentType } from '../dynamic-content/dynamic-content.types';
import { take } from 'rxjs/operators';
import { getDefaults, ToastOptions } from './toast.types';
import { deepmerge } from '../internal/deep-merge';
import { addClass, appendChild, createElement, prependChild } from '../internal/helpers';

@Injectable()
export class DatoToast {
  private contentRef: ContentRef;
  private component: ComponentRef<any>;
  private nativeElement: HTMLElement;
  private toasts = new Map();
  private container: HTMLElement;

  constructor(private translate: DatoTranslateService, private appRef: ApplicationRef, private resolver: ComponentFactoryResolver, private injector: Injector, @Inject(DOCUMENT) private document) {}

  open(content: ContentType, options?: Partial<ToastOptions>) {
    if (!this.container) this.createContainer();

    const mergedOptions = deepmerge(getDefaults(), options || {});
    mergedOptions.id = Math.random();

    this.contentRef = ngContentResolver({
      applicationRef: this.appRef,
      injector: this.injector,
      resolver: this.resolver,
      content: isString(content) ? this.translate.transform(content) : content
    });

    if (!isString(content) && options.data) {
      this.contentRef.componentRef.instance.data = options.data;
    }

    this.component = createComponent<DatoToastComponent>({
      component: DatoToastComponent,
      projectableNodes: this.contentRef.nodes,
      injector: this.injector,
      resolver: this.resolver
    });

    const { instance, changeDetectorRef, location: { nativeElement } } = this.component;
    this.nativeElement = nativeElement;
    instance.options = mergedOptions;

    this.toasts.set(mergedOptions.id, {
      contentRef: this.contentRef,
      component: this.component,
      nativeElement: this.nativeElement
    });

    const toastRef = new ToastRef();
    toastRef.afterDismissed = instance.close;

    instance.close.pipe(take(1)).subscribe(({ id }) => {
      this.destroy(id);
    });

    changeDetectorRef.detectChanges();
    prependChild(this.container, nativeElement);
    return toastRef;
  }

  private destroy(toastId) {
    if (this.toasts.has(toastId)) {
      const current = this.toasts.get(toastId);
      current.contentRef.destroy(this.appRef);
      current.component.destroy();
      this.container.removeChild(current.nativeElement);
      current.nativeElement = null;
      this.toasts.delete(toastId);
    }
  }

  private createContainer() {
    this.container = createElement('div');
    addClass(this.container, ['d-flex', 'd-flex-column', 'dato-toasts-container']);
    appendChild(this.document.body, this.container);
  }
}
