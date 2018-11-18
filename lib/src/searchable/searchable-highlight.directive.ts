/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Directive, ElementRef, Optional, SecurityContext } from '@angular/core';
import { DatoSearchableContainerComponent } from './searchable-container.component';
import { DatoSearchableDirective } from './searchable.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { DatoCoreError } from '../errors';

const pattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

@Directive({
  selector: '[datoSearchableHighlight]'
})
export class DatoSearchableHighlightDirective {
  constructor(@Optional() private container: DatoSearchableContainerComponent, @Optional() private searchable: DatoSearchableDirective, private sanitizer: DomSanitizer, private host: ElementRef) {
    if (!searchable) {
      throw new DatoCoreError(`Missing [datoSearchable] directive`);
    }
  }

  ngOnInit() {
    this.container.register(this, true);
  }

  ngOnDestroy() {
    this.container.unregister(this, true);
  }

  get token() {
    return this.searchable.token;
  }

  highlight(token: string, searchTerm: string) {
    this.host.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.resolve(token, searchTerm));
  }

  resolve(token: string, searchTerm: string) {
    let cleanSearch = searchTerm.replace(pattern, '\\$&');

    cleanSearch = cleanSearch
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');

    const regex = new RegExp(cleanSearch, 'gi');

    return cleanSearch ? token.replace(regex, match => `<span class="dato-highlight">${match}</span>`) : token;
  }
}
