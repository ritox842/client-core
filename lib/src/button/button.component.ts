import { SafeStyle } from './../../../playground/node_modules/@angular/platform-browser/src/security/dom_sanitization_service.d';
import { style } from '@angular/animations';
/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { toBoolean } from '@datorama/utils';
import { setDimensions } from '../internal/custom-dimensions';
import { query } from '../internal/helpers';

@Component({
  selector: 'dato-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoButtonComponent {
  _disabled = false;

  constructor(private host: ElementRef, @Attribute('width') public width, @Attribute('height') public height) {}

  /**
   *
   * @param value
   */
  @Input()
  set disabled(value) {
    this._disabled = toBoolean(value);
  }

  ngOnInit() {
    const button = query('button', this.host.nativeElement);
    const firstChild = button.childNodes[0] as HTMLElement;
    const firstChildTagName = firstChild.tagName;
    if (firstChildTagName === 'DATO-ICON') {
      firstChild.style.marginRight = '4px';
    }
    const lastChild = button.lastChild as HTMLElement;
    if (lastChild.tagName === 'DATO-ICON') {
      lastChild.style.marginLeft = '4px';
    }
    setDimensions(this.width, this.height, button);
  }
}
