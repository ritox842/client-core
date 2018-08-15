/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { query } from '../internal/helpers';
import { setDimensions } from '../internal/custom-dimensions';

@Component({
  selector: 'dato-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoIconButtonComponent {
  /** Whether the button is disabled */
  @Input() disabled = false;
  @Input() datoIcon: string;
  @Input() datoIconColor: string;

  constructor(@Attribute('datoSize') public datoSize, @Attribute('datoType') public datoType, @Attribute('datoCircle') public datoCircle, @Attribute('width') public width, @Attribute('height') public height, @Attribute('iconWidth') public iconWidth, @Attribute('iconHeight') public iconHeight, private host: ElementRef) {}

  ngOnInit() {
    if (this.width || this.height) {
      const button = query('button', this.host.nativeElement);
      setDimensions(this.width, this.height, button);
    }
    if (this.iconWidth || this.iconHeight || this.width || this.height) {
      const icon = query('dato-icon', this.host.nativeElement);
      setDimensions(this.iconWidth || this.width, this.iconHeight || this.height, icon);
    }
  }
}
