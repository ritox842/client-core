/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { DatoSelectOptionComponent } from './select-option.component';
import { getOptionTemplate } from './option-template';

@Component({
  selector: 'dato-option[multi]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DatoSelectOptionComponent, useExisting: DatoSelectMultiOptionComponent }],
  template: getOptionTemplate(true)
})
export class DatoSelectMultiOptionComponent extends DatoSelectOptionComponent {
  constructor(protected cdr: ChangeDetectorRef, protected host: ElementRef) {
    super(cdr, host);
  }
}
