import { Component, ContentChildren, QueryList, Input } from '@angular/core';
import { DatoSearchableDirective } from './searchable.directive';

@Component({
  selector: 'dato-searchable-container',
  template: '<ng-content></ng-content>',
  exportAs: 'datoSearchableContainer'
})
export class DatoSearchableContainerComponent {
  @ContentChildren(DatoSearchableDirective, { descendants: true })
  searchables: QueryList<DatoSearchableDirective>;

  get count() {
    return this._count;
  }
  set count(count: number) {
    this._count = count;
  }
  private _count = 0;

  @Input()
  set datoSearchTerm(value: string) {
    let count = 0;
    if (this.searchables) {
      for (const searchable of this.searchables.toArray()) {
        if (!value) {
          searchable.show();
          count++;
        } else {
          if (searchable.term.indexOf(value) > -1) {
            searchable.show();
            count++;
          } else {
            searchable.hide();
          }
        }
      }
      this.count = count;
    }
  }
}
