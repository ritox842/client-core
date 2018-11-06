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
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, throttleTime } from 'rxjs/operators';
import { isString } from '@datorama/utils';
import { DatoTranslateService } from '../services/translate.service';
import { DatoPanelComponent } from './panel.component';
import { addClass, setStyle } from '../internal/helpers';
import { CoreConfig, DATO_CORE_CONFIG } from '../config';
import { zIndex } from '../internal/z-index';

export type DatoPanelOptions<E = any> = {
  relativeTo?: E | string;
  height?: number | string;
  width?: number | string;
  viewContainerRef?: ViewContainerRef;
  offset?: { top?: number; left?: number };
  backdrop?: { enabled: boolean; selector?: string };
};

@Injectable()
export class DatoPanel {
  private contentRef: ContentRef;
  private component: ComponentRef<any>;
  private nativeElement: HTMLElement;
  private destroy$ = new Subject();
  private onClose = new Subject<boolean>();
  private backdropElement: HTMLElement;
  private backdropClassName = 'dato-panel-backdrop';
  private backDropHolder = 'body';

  close$ = this.onClose.asObservable();

  constructor(private resolver: ComponentFactoryResolver, private translate: DatoTranslateService, private injector: Injector, private appRef: ApplicationRef, @Inject(DATO_CORE_CONFIG) private config: CoreConfig, @Inject(DOCUMENT) private document) {}

  open<E extends Element, T>(content: ContentType<T>, options: DatoPanelOptions<E> = {}): Observable<boolean> {
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

    return this.close$.pipe(take(1));
  }

  private createPanel<E extends Element, T>(content: ContentType<T>, relativeTo, options: DatoPanelOptions<E>) {
    const injector = options.viewContainerRef ? options.viewContainerRef.injector : this.injector;
    const backdrop = options.backdrop;

    if (backdrop && backdrop.enabled) {
      this.createBackdrop(backdrop.selector);
    }

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

    fromEvent(window, 'scroll', { capture: true })
      .pipe(
        throttleTime(10),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.calcPosition(relativeTo, options);
      });

    fromEvent(document.body, 'click', { capture: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const target = event.target as HTMLElement;
        const main = this.document.querySelector(this.config.appSelector);
        const notAppendedToBody = main.contains(target as HTMLElement);
        const isSideNav = this.document.querySelector(this.config.sidenavSelector).contains(target as HTMLElement);
        const isBackdrop = (target as HTMLElement).classList.contains(this.backdropClassName);

        if ((notAppendedToBody && !isSideNav) || isBackdrop) {
          this.close();
        }
      });

    this.activateAnimationEndHook();
  }

  activateAnimationEndHook() {
    fromEvent(this.panelContainer, 'animationend')
      .pipe(
        filter(({ animationName }: AnimationEvent) => animationName === 'panelSlideOut'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.destroy());
  }

  close() {
    if (this.panelContainer) {
      setStyle(this.panelContainer, 'animation', 'panelSlideOut 0.2s');
    }
  }

  private createBackdrop(selector: string) {
    if (selector) {
      this.backDropHolder = selector;
    }

    this.backdropElement = this.document.createElement('div');
    addClass(this.backdropElement, this.backdropClassName);
    setStyle(this.backdropElement, 'zIndex', `${zIndex.panelBackdrop}`);
    this.document.querySelector(this.backDropHolder).appendChild(this.backdropElement);
  }

  private calcPosition(relativeTo: HTMLElement, options: DatoPanelOptions) {
    const { left, top, height, width } = relativeTo.getBoundingClientRect();

    this.component.instance.options = {
      offset: options.offset,
      rect: {
        left,
        top,
        width,
        height: options.height || height,
        boxWidth: options.width
      }
    };
  }

  private get panelContainer() {
    return this.document.querySelector('.dato-panel-container');
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

      if (this.backdropElement) {
        this.document.querySelector(this.backDropHolder).removeChild(this.backdropElement);
      }

      this.nativeElement = null;
      this.destroy$.next();
      this.onClose.next(true);
    }
  }
}
