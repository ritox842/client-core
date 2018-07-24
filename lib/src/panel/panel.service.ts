/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ContentType } from '../dynamic-content/dynamic-content.types';
import { ContentRef, createComponent, ngContentResolver } from '../angular/dynamic-components';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { isString } from '@datorama/utils';
import { DatoTranslateService } from '../services/translate.service';
import { DatoPanelComponent } from './panel.component';
import { setStyle } from '../internal/helpers';
import { CoreConfig, DATO_CORE_CONFIG } from '../config';

export type DatoPanelOptions<E = any> = {
  relativeTo?: E | string;
  height?: string;
  width?: string;
  viewContainerRef?: ViewContainerRef;
  offset?: { top?: number; left?: number };
};

@Injectable()
export class DatoPanel {
  private contentRef: ContentRef;
  private component: ComponentRef<any>;
  private nativeElement: HTMLElement;
  private destroy$ = new Subject();

  constructor(private resolver: ComponentFactoryResolver, private translate: DatoTranslateService, private injector: Injector, private appRef: ApplicationRef, @Inject(DATO_CORE_CONFIG) private config: CoreConfig, @Inject(DOCUMENT) private document: Document) {}

  open<E extends Element, T>(content: ContentType<T>, options: DatoPanelOptions<E> = {}) {
    const _relativeTo = this.resolveRelativeTo(options.relativeTo || this.config.sidenavSelector);

    /**
     * If we have one that is open, close it, wait for the animation to finish
     * and open the current one
     */
    if (this.panelContainer) {
      this.close();
      this.destroy$.pipe(take(1)).subscribe(() => {
        this.createPanel(content, _relativeTo, options);
      });
    } else {
      this.createPanel(content, _relativeTo, options);
    }
  }

  private createPanel<E extends Element, T>(content: ContentType<T>, relativeTo, options: DatoPanelOptions<E>) {
    const injector = options.viewContainerRef ? options.viewContainerRef.injector : this.injector;

    this.contentRef = ngContentResolver({
      applicationRef: this.appRef,
      injector,
      resolver: this.resolver,
      content: isString(content) ? this.translate.transform(content) : content
    });

    this.component = createComponent<DatoPanelComponent>({
      component: DatoPanelComponent,
      projectableNodes: this.contentRef.nodes,
      injector,
      resolver: this.resolver
    });

    const { nativeElement } = this.component.location;
    this.nativeElement = nativeElement;

    this.calcPosition(relativeTo, options);

    this.component.hostView.detectChanges();

    this.document.body.appendChild(nativeElement);
    //throttleTime(10),
    fromEvent(window, 'scroll', { capture: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.calcPosition(relativeTo, options);
      });

    fromEvent(document.body, 'click', { capture: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const main = this.document.querySelector(this.config.appSelector);
        const notAppendedToBody = main.contains(event.target as HTMLElement);
        const isSideNav = this.document.querySelector('.sidenav').contains(event.target as HTMLElement);
        if (notAppendedToBody && !isSideNav) {
          this.close();
        }
      });

    this.activateAnimationEndHook();
  }

  activateAnimationEndHook() {
    fromEvent(this.panelContainer, 'animationend')
      .pipe(filter(({ animationName }: AnimationEvent) => animationName === 'panelSlideOut'), takeUntil(this.destroy$))
      .subscribe(() => this.destroy());
  }

  close() {
    if (this.panelContainer) {
      setStyle(this.panelContainer, 'animation', 'panelSlideOut 0.2s');
    }
  }

  private calcPosition(relativeTo: HTMLElement, options: DatoPanelOptions) {
    const { left, top, height, width } = relativeTo.getBoundingClientRect();

    this.component.instance.options = {
      offset: options.offset,
      rect: {
        left,
        top,
        width: options.width || width,
        height: options.height || height
      }
    };
  }

  private get panelContainer() {
    return this.document.querySelector('.panel-container');
  }

  private resolveRelativeTo(element) {
    if (isString(element)) {
      return this.document.querySelector(element);
    }

    return element;
  }

  private destroy() {
    if (this.panelContainer) {
      this.contentRef.destroy(this.appRef);
      this.component.destroy();
      this.document.body.removeChild(this.nativeElement);
      this.nativeElement = null;
      this.destroy$.next();
    }
  }
}
