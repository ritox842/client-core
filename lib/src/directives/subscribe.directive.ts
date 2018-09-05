/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { isFunction } from '@datorama/utils';

export class DatoSubscribeContext {
  public $implicit: any = null;
  public datoSubscribe: any = null;
}

@Directive({
  selector: '[datoSubscribe]'
})
export class DatoSubscribeDirective implements OnInit, OnDestroy {
  private observable: Observable<any>;
  private context: DatoSubscribeContext = new DatoSubscribeContext();
  private subscription: Subscription;

  @Input()
  set datoSubscribe(inputObservable: Observable<any> | Observable<any>[]) {
    let observables = inputObservable;
    if (this.observable !== inputObservable) {
      this.subscription && this.subscription.unsubscribe();
      if (this.isObject(inputObservable)) {
        observables = this.buildObservablesFromObject(inputObservable);
      }
      this.observable = combineLatest(observables);
      this.subscription = this.observable.subscribe(value => {
        if (this.isObject(inputObservable)) {
          const asObject = value.reduce((acc, current) => {
            acc[current.key] = current.value;
            return acc;
          }, {});
          this.context.datoSubscribe = asObject;
        } else {
          this.context.datoSubscribe = Array.isArray(inputObservable) ? value : value[0];
        }
        this.cdr.markForCheck();
      });
    }
  }

  constructor(private viewContainer: ViewContainerRef, private cdr: ChangeDetectorRef, private templateRef: TemplateRef<any>) {}

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

  private isObject(inputObservable) {
    return Array.isArray(inputObservable) === false && isFunction((inputObservable as Observable<any>).subscribe) === false;
  }

  private buildObservablesFromObject(inputObservable) {
    return Object.keys(inputObservable).map(key => {
      return inputObservable[key].pipe(
        map(v => {
          return {
            key,
            value: v
          };
        })
      );
    });
  }
}
