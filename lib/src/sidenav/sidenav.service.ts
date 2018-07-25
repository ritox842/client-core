/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector, Type, ViewContainerRef } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { setStyle } from '../internal/helpers';
import { DatoTranslateService } from '../services/translate.service';
import { DOCUMENT } from '@angular/common';
import { CoreConfig, DATO_CORE_CONFIG } from '../config';
import { ContentRef } from '../angular/dynamic-components';
import { SIDENAV_DEFAULT } from './sidenav-default.provider';

type ContainerConfig = {
  viewContainerRef: ViewContainerRef;
  isOpen?: boolean;
  component?: Type<any>;
  initialOpen?: boolean;
};

@Injectable()
export class DatoSidenav {
  private containers = new Map<string, ContainerConfig>();
  private contentRef: ContentRef;
  private component: ComponentRef<any>;
  private nativeElement: HTMLElement;
  private destroy$ = new Subject();

  constructor(private resolver: ComponentFactoryResolver, private translate: DatoTranslateService, private injector: Injector, private appRef: ApplicationRef, @Inject(DATO_CORE_CONFIG) private config: CoreConfig, @Inject(SIDENAV_DEFAULT) private sideNavDefault: Type<any>, @Inject(DOCUMENT) private document) {}

  open<T>(component: Type<T>, options = {}) {
    const container = this.containers.get('left');
    this.containers.get('left').component = component;

    if (!container.initialOpen && container.component === component && container.isOpen) {
      container.viewContainerRef.clear();
      container.isOpen = false;
      container.initialOpen = false;
    } else {
      const componentFactory = this.resolver.resolveComponentFactory(component);
      container.viewContainerRef.clear();
      container.viewContainerRef.createComponent(componentFactory, container.viewContainerRef.length, this.injector);
      container.isOpen = true;
      container.initialOpen = false;
    }
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

  private get panelContainer() {
    return this.document.querySelector('.panel-container');
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

  _registerContainer(position: 'right' | 'left', viewContainerRef: ViewContainerRef) {
    this.containers.set(position, {
      viewContainerRef,
      isOpen: true,
      component: this.sideNavDefault,
      initialOpen: true
    });

    if (position === 'left') {
      this.open(this.sideNavDefault);
    }
  }
}
