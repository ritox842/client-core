/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[datoActive]'
})
export class DatoSelectActiveDirective {
  @Input('datoActive') active;

  constructor(public tpl: TemplateRef<any>) {}
}
