/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, Input, OnDestroy, Optional, QueryList, SkipSelf } from '@angular/core';
import { DatoAccordionGroupComponent } from '../accordion-group/accordion-group.component';
import { merge, Subscription, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { toBoolean } from '@datorama/utils';
import { untilDestroyed } from 'ngx-take-until-destroy';
@Component({
  selector: 'dato-accordion',
  template: '<ng-content></ng-content>',
  exportAs: 'datoAccordion',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class DatoAccordionComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(DatoAccordionGroupComponent)
  groups: QueryList<DatoAccordionGroupComponent>;
  @ContentChildren(DatoAccordionComponent, { descendants: true })
  childAccordion: QueryList<DatoAccordionComponent>;

  @Input()
  closeOthers = false;
  @Input()
  expandAll = false;
  @Input()
  includeArrows = false;
  @Input()
  activeIds: number | number[] = [];

  @Input()
  set searchTerm(searchTerm: string) {
    if (this.groups) {
      searchTerm = searchTerm || '';

      for (const group of this.asArray) {
        if (!searchTerm) {
          this.toggleGroup(group, false);
          group.hide(false);
          group.header.searchResultLength = 0;
        } else {
          const searchables = group.content.searchable;
          const result = searchables.filter(({ term }) => term.indexOf(searchTerm.toLowerCase()) > -1);
          group.hide(!result.length);
          group.expand(!!result.length);
          group.header.searchResultLength = result.length;
        }
      }
    }
  }

  private groupsSubscription: Subscription;

  constructor(
    @SkipSelf()
    @Optional()
    private parent: DatoAccordionComponent,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes) {
    if (changes.expandAll && !changes.expandAll.firstChange) {
      this.setExpandAll();
    }

    if (changes.activeIds && !changes.activeIds.firstChange) {
      this.groups.forEach(g => this.toggleGroup(g, false));
      this.setExpandAll(changes.activeIds.currentValue);
    }
  }

  toggle(index: number) {
    const group = this.groups.toArray()[index];
    if (toBoolean(group)) {
      this.onGroupClick(group);
    } else {
      console.error(`Group ${index} doesn't exists`);
    }
  }

  setExpandAll(ids?: any[]) {
    let toArray = ids;
    if (!toArray) {
      toArray = this.groups.toArray().map((_, i) => i);
    }
    for (const index of toArray) {
      const group = this.groups.toArray()[index];
      if (!this.parent && !group._disabled) {
        this.onGroupClick(group, true);
      }
    }
  }

  get asArray() {
    return this.groups.toArray();
  }

  ngAfterContentInit() {
    this.groups.changes.pipe(untilDestroyed(this)).subscribe(() => {
      this.register();
    });

    this.register();
    if (this.includeArrows) {
      this.updateIncludeArrows();
      this.groups.changes.pipe(untilDestroyed(this)).subscribe(this.updateIncludeArrows.bind(this));
    }

    setTimeout(() => this.initialOpen(this.activeIds));
  }

  private updateIncludeArrows() {
    for (const group of this.groups.toArray()) {
      group.header.includeArrow = true;
    }
  }

  private register() {
    if (this.groupsSubscription) {
      this.groupsSubscription.unsubscribe();
    }

    this.groupsSubscription = merge(...this.groups.map(group => group.header.click$.pipe(mapTo(group)))).subscribe((group: DatoAccordionGroupComponent) => {
      this.onGroupClick(group);
    });
  }

  private onGroupClick(group: DatoAccordionGroupComponent, force = false) {
    if (group._disabled) {
      return;
    }

    if (this.closeOthers && !group.content._expanded) {
      for (const g of this.groups.toArray()) {
        if (g !== group) {
          this.closeAndEmit(g);
        }
      }
    }

    this.toggleGroup(group, force ? true : !group.content._expanded);

    const children = this.getChildAccordionsComponents();

    if (children.length) {
      children.forEach(child => child.groups.forEach(g => this.closeAndEmit(g)));
    }

    this.emitToggle(group);
    this.cdr.markForCheck();
  }

  private toggleGroup(group: DatoAccordionGroupComponent, expanded = true) {
    group.content.expanded = expanded;
    group.header.expanded = expanded;
  }

  private getChildAccordionsComponents() {
    return this.childAccordion.filter(child => child !== this);
  }

  private coerceArray<T>(value): T[] {
    return Array.isArray(value) ? value : [value];
  }

  private initialOpen(activeIds: number | number[]) {
    const toArray = this.expandAll ? this.groups.toArray().map((_, i) => i) : this.coerceArray<number>(activeIds);
    this.setExpandAll(toArray);
  }

  private emitToggle(group: DatoAccordionGroupComponent, value?: boolean) {
    if (group.toggle.observers.length) {
      const expanded = value == null ? group.content._expanded : value;
      group.toggle.next({ expanded });
    }
  }

  private closeAndEmit(group: DatoAccordionGroupComponent) {
    if (group.content._expanded) {
      this.emitToggle(group, false);
    }
    this.toggleGroup(group, false);
  }

  ngOnDestroy() {
    this.groupsSubscription && this.groupsSubscription.unsubscribe();
  }
}
