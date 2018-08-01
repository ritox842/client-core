/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injector, TemplateRef, Type, ViewRef } from '@angular/core';
import { ContentType } from '../dynamic-content/dynamic-content.types';

export type NewComponentParams = {
  resolver: ComponentFactoryResolver;
  component: Type<any>;
  injector: Injector;
  projectableNodes?: any[][];
};

export type ContentResolverParams = {
  content: ContentType;
  resolver: ComponentFactoryResolver;
  injector: Injector;
  applicationRef: ApplicationRef;
  context?: object;
};

/**
 * Create dynamic component
 *
 * const component = createComponent<DatoSnackbarComponent>({
 *   component: DatoSnackbarComponent,
 *   projectableNodes: contentRef.nodes,
 *   injector: this.injector,
 *   resolver: this.resolver
 * });
 *
 * @param {ComponentFactoryResolver} resolver
 * @param {Type<any>} component
 * @param {Injector} injector
 * @param {any[][]} projectableNodes
 * @returns {ComponentRef<T>}
 */
export function createComponent<T = any>({ resolver, component, injector, projectableNodes }: NewComponentParams) {
  const factory = resolver.resolveComponentFactory(component);
  const componentRef: ComponentRef<T> = factory.create(injector, projectableNodes);
  return componentRef;
}

export class ContentRef {
  constructor(public nodes: any[], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}

  /**
   *
   * @param {ApplicationRef} applicationRef
   */
  destroy(applicationRef: ApplicationRef) {
    this.viewRef && applicationRef.detachView(this.viewRef);
    this.viewRef && this.viewRef.destroy();
    this.componentRef && this.componentRef.destroy();
    this.viewRef = null;
    this.componentRef = null;
    this.nodes = null;
  }
}

/**
 *
 * Resolves ng content from a String/TemplateRef/Component
 *
 * const contentRef = ngContentResolver({
 *    applicationRef: this.appRef,
 *    injector: this.injector,
 *    resolver: this.resolver,
 *    content
 * });
 *
 * @param {ContentType} content
 * @param {ComponentFactoryResolver} resolver
 * @param {Injector} injector
 * @param {ApplicationRef} applicationRef
 * @param {object} context
 * @returns {ContentRef}
 */
export function ngContentResolver({ content, resolver, injector, applicationRef, context }: ContentResolverParams): ContentRef {
  if (typeof content === 'string') {
    const component = document.createTextNode(content);
    return new ContentRef([[component]]);
  }

  if (content instanceof TemplateRef) {
    const viewRef = content.createEmbeddedView(context);
    applicationRef.attachView(viewRef);
    return new ContentRef([viewRef.rootNodes], viewRef);
  }

  const factory = resolver.resolveComponentFactory(content);
  const innerComponentRef = factory.create(injector);
  applicationRef.attachView(innerComponentRef.hostView);

  return new ContentRef([[innerComponentRef.location.nativeElement]], innerComponentRef.hostView, innerComponentRef);
}
