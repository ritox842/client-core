/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https:github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { SnackbarOptions, SnackbarType } from './snackbar.types';
import { SnackbarRefDismiss } from './snackbar-ref';
import { setStyle } from '../internal/helpers';
import { zIndex } from '../internal/z-index';

@Component({
  selector: 'dato-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: [`./snackbar.component.scss`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoSnackbarComponent implements OnInit {
  @Input() options: SnackbarOptions;
  @Input() type: SnackbarType;

  icon: 'checkmark' | 'close';
  showLeftIcon = false;
  close = new EventEmitter<SnackbarRefDismiss>();

  private closedByAction = false;
  private animate;

  @HostListener('animationend', ['$event'])
  onAnimationEnd({ animationName }) {
    if (animationName === 'snackbarOut') {
      this.close.emit({
        closedByAction: this.closedByAction
      });
    }
  }

  get dismissible() {
    return this.options.dismissible;
  }

  get duration() {
    return this.options.duration;
  }

  get element() {
    return this.host.nativeElement;
  }

  constructor(private renderer: Renderer2, private host: ElementRef) {}

  ngOnInit() {
    setStyle(this.host.nativeElement, 'zIndex', `${zIndex.snackbar}`);
    this.showLeftIcon = !this.isInfo(this.type);
    this.animate = value => this.renderer.setStyle(this.element, 'animation', value);
    this.icon = this.resolveIcon(this.type);
    this.renderer.addClass(this.element, `dato-snackbar-${this.type.toLowerCase()}`);

    if (this.dismissible) {
      this.animate(`snackbarIn 0.5s`);
    } else {
      this.animate(`snackbarIn 0.5s, snackbarOut 0.5s ${this.duration}ms`);
    }
  }

  onClose() {
    this.animate(`snackbarOut 0.5s`);
    this.closedByAction = true;
  }

  /**
   *
   * @param {SnackbarType} type
   * @returns {boolean}
   */
  private isInfo(type: SnackbarType) {
    return type === SnackbarType.INFO;
  }

  /**
   *
   * @param {SnackbarType} type
   * @returns {boolean}
   */
  private isSuccess(type: SnackbarType) {
    return type === SnackbarType.SUCCESS || type === SnackbarType.DRAMATIC_SUCCESS;
  }

  /**
   *
   * @param {SnackbarType} type
   * @returns {string}
   */
  private resolveIcon(type: SnackbarType) {
    if (!this.isInfo(type)) {
      return this.isSuccess(type) ? 'checkmark' : 'close';
    }
  }
}
