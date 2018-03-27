/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, Component } from '@angular/core';
import { typographyType } from './font.config';

@Component({
  selector: 'dato-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTextComponent {
  klass: typographyType;

  constructor(@Attribute('type') type) {
    this.klass = type;
  }
}
