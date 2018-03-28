/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, Input, TemplateRef } from '@angular/core';
import { RowSelectionType, showWhenFunc, ToolbarActionType } from './grid-toolbar';

@Directive({
  selector: '[datoGridToolbarItem]'
})
export class DatoGridToolbarItemDirective {
  @Input() showWhen: RowSelectionType | showWhenFunc;
  @Input() actionType: ToolbarActionType;
  @Input() order: number;

  constructor(public tpl: TemplateRef<any>) {}
}

@Directive({
  selector: '[datoGridToolbarItemElement]'
})
export class DatoGridToolbarItemElementDirective {
  constructor(public element: ElementRef) {}
}
