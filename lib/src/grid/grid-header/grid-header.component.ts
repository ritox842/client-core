/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { AgGridEvent } from 'ag-grid';
import { DatoGridComponent } from '../grid/grid.component';

@Component({
  selector: 'dato-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: [`./grid-header.component.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoGridHeaderComponent {
  destroyed$: Observable<boolean>;
  rowCount = 0;

  private rowDataChanged;

  constructor(private cdr: ChangeDetectorRef) {}

  /**
   *
   * @param {DatoGridComponent} grid
   */
  @Input()
  set grid(grid: DatoGridComponent) {
    if (!this.rowDataChanged) {
      this.rowDataChanged = grid.rowDataChanged.pipe(untilDestroyed(this)).subscribe((grid: AgGridEvent) => {
        this.rowCount = grid.api.getDisplayedRowCount();
        this.cdr.detectChanges();
      });
    }
  }

  ngOnDestroy(): void {}
}
