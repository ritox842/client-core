/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DatoSearchableDirective } from './searchable.directive';
import { DatoSearchableHighlightDirective } from './searchable-highlight.directive';

@Component({
  selector: 'dato-searchable-container',
  template: `
    <ng-content></ng-content>
  `,
  exportAs: 'datoSearchableContainer',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoSearchableContainerComponent {
  private searchables: DatoSearchableDirective[] = [];
  private searchablesHighlight: DatoSearchableHighlightDirective[] = [];
  private contentInit = false;

  private _count = 0;
  get count() {
    return this._count;
  }

  set count(count: number) {
    this._count = count;
  }

  private _term = '';
  @Input('datoSearchTerm')
  set term(searchTerm: string) {
    this._term = searchTerm || '';
    if (this.contentInit) {
      this.magic(this._term);
    }
  }

  get term() {
    return this._term;
  }

  magic(searchTerm: string) {
    this.handleSearchables(searchTerm);
    this.handleHighlighters(searchTerm);
  }

  register(searchable: DatoSearchableDirective | DatoSearchableHighlightDirective, highlight = false) {
    if (highlight) {
      this.searchablesHighlight.push(searchable as DatoSearchableHighlightDirective);
    } else {
      this.searchables.push(searchable as DatoSearchableDirective);
    }
  }

  unregister(searchable: DatoSearchableDirective | DatoSearchableHighlightDirective, highlight = false) {
    let arr = 'searchables';
    if (highlight) {
      arr = 'searchablesHighlight';
    }

    this[arr] = this[arr].filter(current => current !== searchable);
  }

  ngAfterContentInit() {
    this.contentInit = true;
    this.magic(this.term);
  }

  ngOnDestroy() {
    this.searchables = [];
    this.searchablesHighlight = [];
  }

  private handleSearchables(searchTerm: string) {
    let count = 0;
    for (const searchable of this.searchables) {
      if (!searchTerm) {
        searchable.show();
        count++;
      } else {
        if (searchable.token.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          searchable.show();
          count++;
        } else {
          searchable.hide();
        }
      }
    }
    this.count = count;
  }

  private handleHighlighters(searchTerm: string) {
    for (const searchableHighlight of this.searchablesHighlight) {
      searchableHighlight.highlight(searchableHighlight.token, searchTerm);
    }
  }
}
