///**
// * @license
// * Copyright Datorama. All Rights Reserved.
// *
// * Use of this source code is governed by an Apache License 2.0 license that can be
// * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
// */
//
//import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
//import { DatoOriginDirective } from '../directives/public_api';
//import Popper from 'popper.js';
//import { DatoDropdownComponent } from './../shared/dropdown/dropdown.component';
//import PopperOptions = Popper.PopperOptions;
//import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
//import { Observable } from 'rxjs/Observable';
//import { takeUntil } from 'rxjs/operators';
//import { Subject } from 'rxjs/Subject';
//import { fromEvent } from 'rxjs/observable/fromEvent';
//

//@Component({
//  selector: 'dato-action-menu',
//  template: '<ng-content></ng-content>',
//  styleUrls: ['./action-menu.component.scss'],
//  encapsulation: ViewEncapsulation.None,
//  changeDetection: ChangeDetectionStrategy.OnPush
//})
//export class DatoActionMenuComponent implements AfterContentInit, OnDestroy {
//  @ContentChild(DatoOriginDirective) origin: DatoOriginDirective;
//  @ContentChild(DatoDropdownComponent) dropdown: DatoDropdownComponent;
//
//  @Input() placement = 'bottom-start';
//  close$ = new Subject();
//  destroyed$: Observable<boolean>;
//  private overlay: HTMLElement;
//  private popper: Popper;
//  private isOpen = false;
//
//  constructor(private host: ElementRef, private renderer: Renderer2) {}
//
//  ngAfterContentInit() {
//    this.dropdown.click.pipe(takeUntil(this.destroyed$)).subscribe((event: Event) => {
//      event.stopPropagation();
//      this.close();
//    });
//
//    this.origin.click.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
//      this.isOpen = !this.isOpen;
//      if (this.isOpen) {
//        this.open();
//      } else {
//        this.close();
//      }
//    });
//  }
//
//  /**
//   * Append the dropdown to body and init popper
//   */
//  open() {
//    this.overlay = this.createOverlay();
//    this.overlay.appendChild(this.dropdown.element);
//    document.body.appendChild(this.overlay);
//    this.popper = new Popper(this.origin.element, this.dropdown.element, this.getOptions() as any);
//  }
//
//  /**
//   * Destroy popper and hide the dropdown
//   */
//  close() {
//    this.isOpen = false;
//    this.toggleDropdown(false);
//    this.close$.next();
//    this.popper && this.popper.destroy();
//    if (this.overlay) {
//      document.body.removeChild(this.overlay);
//      this.overlay = null;
//    }
//  }
//
//  /**
//   *
//   * @param {boolean} show
//   * @private
//   */
//  private toggleDropdown(show = true) {
//    const display = show ? 'inline-block' : 'none';
//    this.renderer.setStyle(this.dropdown.element, 'display', display);
//  }
//
//  /**
//   *
//   * @returns Partial<PopperOptions>
//   * @private
//   */
//  private getOptions() {
//    return {
//      placement: this.placement,
//      modifiers: {
//        applyStyle: {
//          onLoad: () => {
//            this.toggleDropdown();
//          }
//        }
//      }
//    };
//  }
//
//  /**
//   *
//   * @returns {HTMLElement}
//   */
//  private createOverlay(): HTMLElement {
//    const div = this.renderer.createElement('div');
//    div.classList.add('dato-overlay-clean');
//
//    fromEvent(div, 'click')
//      .pipe(takeUntil(this.close$))
//      .subscribe(() => {
//        this.close();
//      });
//
//    return div;
//  }
//
//  /**
//   * Cleaning
//   */
//  ngOnDestroy() {
//    this.close();
//    this.close$.complete();
//  }
//}
