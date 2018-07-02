/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

export function getAccordionTemplate() {
  return `
ACCORDION!!!!
<ng-content></ng-content>
  `;
}

export function getListTemplate(isAccordion = false) {
  return `
    <div>
    <dato-input datoSize="lg"
                [placeholder]="_searchPlaceholder"
                (keyup)="keyup($event)"
                [isFocused]="_focus"
                [isLoading]="isLoading"
                [formControl]="searchControl"
                type="search">
    </dato-input>
    ${isAccordion ? getAccordionTemplate() : '<ng-content></ng-content>'}
</div>
  `;
  //   return `
  //   <div class="dato-select__option
  //        dato-select__option--simple
  //        dato-select__option--hover"
  //        [class.force-hide]="hide"
  //        ${isMulti ? '' : '[class.dato-option--active]="active"'}
  //        [class.dato-select__option--disabled]="_disabled"
  //        [class.dato-option--keyboard-active]="activeByKeyboard"
  //        >
  //     ${isMulti ? getMultiTemplate() : '<ng-content></ng-content>'}
  //   </div>
  // `;
}
