/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoPanelComponent } from './panel.component';
import { DatoPanelHeaderComponent } from './panel-header.component';
import { DatoPanelContentComponent } from './panel-content.component';
import { DatoPanelFooterComponent } from './panel-footer.component';
import { DatoIconModule } from '../icon/icon.module';

const publicApi = [DatoPanelComponent, DatoPanelHeaderComponent, DatoPanelContentComponent, DatoPanelFooterComponent];

@NgModule({
  imports: [CommonModule, DatoIconModule],
  declarations: [publicApi],
  exports: [publicApi],
  entryComponents: [publicApi]
})
export class DatoPanelModule {}
