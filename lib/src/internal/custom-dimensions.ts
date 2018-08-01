/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { setStyle } from './helpers';

export function setDimensions(width: string, height: string, element: Element, prefix: 'min-' | 'max-' | '' = '') {
  if (width) {
    setStyle(element, `${prefix}width`, width);
  }
  if (height) {
    setStyle(element, `${prefix}height`, height);
  }
}

export function setMinDimensions(width: string, height: string, element: Element) {
  setDimensions(width, height, element, 'min-');
}

export function setMaxDimensions(width: string, height: string, element: Element) {
  setDimensions(width, height, element, 'max-');
}
