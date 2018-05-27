/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { setStyle } from './helpers';

export function setDimensions(width: string, height: string, element: Element) {
  if (width) {
    setStyle(element, 'width', width);
  }
  if (height) {
    setStyle(element, 'height', height);
  }
}
