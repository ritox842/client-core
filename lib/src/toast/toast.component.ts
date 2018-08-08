import { zIndex } from './../internal/z-index';

/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https:github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, ViewEncapsulation, TemplateRef, Type } from '@angular/core';
import { ToastRefDismiss } from './toast-ref';
import { ToastOptions } from './toast.types';
import { setStyle, query } from '../internal/helpers';

@Component({
  selector: 'dato-toast',
  templateUrl: './toast.component.html',
  styleUrls: [`./toast.component.scss`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoToastComponent implements OnInit {
  @Input() options: ToastOptions;
  close = new EventEmitter<ToastRefDismiss>();

  private closedByAction = false;

  @HostListener('animationend', ['$event'])
  onAnimationEnd({ animationName }) {
    if (animationName === 'toastOut') {
      this.close.emit({
        id: this.options.id,
        closedByAction: this.closedByAction
      });
    }
  }

  get duration() {
    return this.options.duration;
  }

  get icon() {
    return this.options.icon;
  }

  get content() {
    return this.options.content;
  }

  get element() {
    return this.host.nativeElement;
  }

  constructor(private host: ElementRef) {}

  ngOnInit() {
    setStyle(query('.dato-toasts-container'), 'zIndex', zIndex.toast.toString());
    setStyle(this.element, 'animation', `toastIn 0.4s, toastOut 0.5s ${this.duration}ms`);
  }

  onClose() {
    this.closedByAction = true;
    this.close.emit({
      id: this.options.id,
      closedByAction: this.closedByAction
    });
  }
}
