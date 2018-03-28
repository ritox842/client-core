/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoGridComponent } from './grid/grid.component';
import { DatoGridToolbarComponent } from './grid-toolbar/grid-toolbar.component';
import { DatoGridPaginationComponent } from './grid-pagination/grid-pagination.component';
import { AgGridModule } from 'ag-grid-angular';
import { DatoIconButtonModule } from '../icon-button/icon-button.module';
import { DatoLinkButtonModule } from '../link-button/link-button.module';
import { DatoButtonModule } from '../button/button.module';
import { DatoIconModule } from '../icon/icon.module';
import { DatoTextModule } from '../text/text.module';
import {
  DatoGridToolbarItemDirective,
  DatoGridToolbarItemElementDirective
} from './grid-toolbar/grid-toolbar-item.directive';
import { DatoThemesModule } from '../themes/themes.module';
import { DatoGridHeaderComponent } from './grid-header/grid-header.component';

const declerations = [
  DatoGridComponent,
  DatoGridPaginationComponent,
  DatoGridToolbarComponent,
  DatoGridToolbarItemDirective,
  DatoGridToolbarItemElementDirective,
  DatoGridHeaderComponent
];

@NgModule({
  imports: [
    CommonModule,
    DatoButtonModule,
    DatoLinkButtonModule,
    DatoIconButtonModule,
    DatoIconModule,
    DatoTextModule,
    DatoThemesModule,
    AgGridModule.withComponents([])
  ],
  declarations: [declerations],
  exports: [AgGridModule, DatoIconButtonModule, ...declerations]
})
export class DatoGridModule {}
