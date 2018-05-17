/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Renderer2 } from '@angular/core';

export function setDimensions(width: string, height: string, element: Element, renderer: Renderer2) {
  if (width) {
    renderer.setStyle(element, 'width', width);
  }
  if (height) {
    renderer.setStyle(element, 'height', height);
  }
}
