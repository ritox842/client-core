/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

export function getMultiTemplate() {
  return `
      <div class="dato-checkbox"><label><p datoFont><ng-content></ng-content></p><input type="checkbox" [checked]="_active" [disabled]="_disabled"><span class="checkmark"></span></label></div>
  `;
}

export function getOptionTemplate(isMulti = false) {
  return `
    <div class="dato-select__option 
         dato-select__option--simple 
         dato-select__option--hover"
         [class.force-hide]="hide"
         ${isMulti ? '' : '[class.dato-option--active]="active"'}
         [class.dato-option--keyboard-active]="activeByKeyboard"
         >
      ${isMulti ? getMultiTemplate() : '<ng-content></ng-content>'} 
    </div>
  `;
}
