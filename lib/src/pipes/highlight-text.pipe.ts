/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Pipe, PipeTransform } from '@angular/core';
import { escape } from '@datorama/utils';

const pattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

@Pipe({ name: 'datoHighlight' })
export class DatoHighlightPipe implements PipeTransform {
  transform(text: string, search): string {
    const escText = escape(text || '');
    const escSearch = escape(search || '');

    let cleanSearch = escSearch.replace(pattern, '\\$&');

    cleanSearch = cleanSearch
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');

    const regex = new RegExp(cleanSearch, 'gi');

    return cleanSearch ? escText.replace(regex, match => `<span class="dato-highlight">${match}</span>`) : escText;
  }
}
