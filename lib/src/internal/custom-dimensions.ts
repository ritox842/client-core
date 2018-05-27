/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Renderer2 } from '@angular/core';

export function setDimensions(width: string, height: string, element: Element, renderer: Renderer2, prefix = '') {
  if (width) {
    renderer.setStyle(element, `${prefix}width`, width);
  }
  if (height) {
    renderer.setStyle(element, `${prefix}height`, height);
  }
}

export function setMinDimensions(width: string, height: string, element: Element, renderer: Renderer2) {
  setDimensions(width, height, element, renderer, 'min-');
}

export function setMaxDimensions(width: string, height: string, element: Element, renderer: Renderer2) {
  setDimensions(width, height, element, renderer, 'max-');
}
