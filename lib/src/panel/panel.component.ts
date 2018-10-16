/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { setStyle } from '../internal/helpers';
import { zIndex } from '../internal/z-index';
import { coerceCssPixelValue } from '@angular/cdk/coercion';

@Component({
  selector: 'dato-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoPanelComponent {
  @Input()
  set options({ rect, offset = {} }: { rect: Partial<ClientRect> & { boxWidth: number }; offset?: { top?: number; left?: number } }) {
    this.container.style.height = coerceCssPixelValue(rect.height);

    if (rect.boxWidth) {
      this.container.style.width = coerceCssPixelValue(rect.boxWidth);
      this.container.style.minWidth = coerceCssPixelValue(rect.boxWidth);
    }

    this.host.nativeElement.style.left = `${rect.left + rect.width + (offset.left ? offset.left : 0)}px`;
    this.host.nativeElement.style.top = `${rect.top + (offset.top ? offset.top : 0)}px`;
  }

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    setStyle(this.host.nativeElement, 'zIndex', `${zIndex.panel}`);
  }

  get container(): HTMLElement {
    return this.host.nativeElement.querySelector('.dato-panel-container');
  }
}
