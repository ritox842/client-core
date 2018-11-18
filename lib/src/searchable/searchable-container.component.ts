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
      this.search(this._term);
    }
  }

  get term() {
    return this._term;
  }

  search(searchTerm: string) {
    this.handleSearchables(searchTerm);
    this.handleHighlighters(searchTerm);
  }

  register(searchable: DatoSearchableDirective | DatoSearchableHighlightDirective, highlight = false) {
    if (highlight) {
      this.searchablesHighlight.push(searchable as DatoSearchableHighlightDirective);
    } else {
      this.searchables.push(searchable as DatoSearchableDirective);
    }

    /** For later arrives */
    if (this.contentInit) {
      if (highlight) {
        (searchable as DatoSearchableHighlightDirective).highlight(searchable.token, this._term);
      } else {
        if (this.match(searchable as DatoSearchableDirective)) {
          (searchable as DatoSearchableDirective).show();
          this.count++;
        } else {
          (searchable as DatoSearchableDirective).hide();
        }
      }
    }
  }

  unregister(searchable: DatoSearchableDirective | DatoSearchableHighlightDirective, highlight = false) {
    if (highlight) {
      this.searchablesHighlight = this.searchablesHighlight.filter(current => current !== searchable);
    } else {
      this.searchables = this.searchables.filter(current => current !== searchable);
    }
  }

  ngAfterContentInit() {
    this.contentInit = true;
    this.search(this.term);
  }

  ngOnDestroy() {
    this.searchables = [];
    this.searchablesHighlight = [];
  }

  private match(searchable: DatoSearchableDirective) {
    return searchable.token.toLowerCase().indexOf(this._term.toLowerCase()) > -1;
  }

  private handleSearchables(searchTerm: string) {
    let count = 0;
    for (const searchable of this.searchables) {
      if (!searchTerm) {
        searchable.show();
        count++;
      } else {
        if (this.match(searchable)) {
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
