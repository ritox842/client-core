/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, forwardRef, Inject, Input, OnDestroy, Optional, QueryList, SkipSelf } from '@angular/core';
import { AccordionGroupComponent } from '../accordion-group/accordion-group.component';
import { merge } from 'rxjs/observable/merge';
import { mapTo } from 'rxjs/operators';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { toBoolean } from '@datorama/utils';

@TakeUntilDestroy()
@Component({
  selector: 'dato-accordion',
  template: `
    <ng-content></ng-content>
  `,
  styles: [
    `:host {
    display: block
  }`
  ]
})
export class AccordionComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(AccordionGroupComponent) groups: QueryList<AccordionGroupComponent>;
  @Input() collapseOthers = false;
  @Input() selectedIndex = 0;
  @Input() expandAll: boolean;

  constructor(
    @Optional()
    @SkipSelf()
    @Inject(forwardRef(() => AccordionComponent))
    private parent: AccordionComponent,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterContentInit() {
    // if expandAll is set, use it to determine whether to expand/collapse all groups
    if (toBoolean(this.expandAll)) {
      this.toggleAllExpanding(this.expandAll);
      // otherwise, all groups are initially collapsed apart from the one determined by selectedIndex
    } else {
      // if expandAll and selectedIndex aren't set, default behavior is that the first group is expanded and the rest aren't
      // if it's a child accordion default behavior is that no group is initially expanded
      if (this.selectedIndex === 0 && !this.parent) {
        this.toggleGroupExpanding(this.groups.first, true);
      }

      if (this.selectedIndex !== 0) {
        const group = this.groups.find((_, index) => index === this.selectedIndex);
        if (group) {
          this.toggleGroupExpanding(group, true);
        }
      }
    }

    // listen to clicks on group headers which control the group's expanded state
    merge(...this.groups.map(group => group.header.click$.pipe(mapTo(group))))
      .pipe(untilDestroyed(this))
      .subscribe((group: AccordionGroupComponent) => {
        if (this.collapseOthers && !group.content.isExpanded) {
          this.toggleAllExpanding(false);
        }

        this.toggleGroupExpanding(group, !group.content.isExpanded);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {}

  /**
   * Expand or collapse all groups in the accordion
   * @param {boolean} expand - true for expand, false for collapse
   */
  public toggleAllExpanding(expand: boolean) {
    this.groups.forEach(group => {
      this.toggleGroupExpanding(group, expand);
    });
  }

  /**
   * Expand or collapse a group in the accordion
   * @param {AccordionGroupComponent} group
   * @param {boolean} expand - true for expand, false for collapse
   */
  private toggleGroupExpanding(group: AccordionGroupComponent, expand: boolean) {
    group.content.isExpanded = expand;
    group.header.isExpanded = expand;
    if (expand) {
      group.expand.emit();
    } else {
      group.collapse.emit();
    }
  }
}
