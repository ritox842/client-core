/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ContentType } from '../dynamic-content/dynamic-content.types';
import { IconInputs } from '../icon/icon.types';

export type ToastOptions = {
  id?: number;
  duration?: number;
  content?: ContentType;
  icon: IconInputs;
};

export function getDefaults(): ToastOptions {
  return {
    duration: 4000,
    icon: {
      color: 'primary-300'
    }
  };
}
