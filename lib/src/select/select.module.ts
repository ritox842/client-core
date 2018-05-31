/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSelectComponent } from './select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { DatoOptionDirective } from './select-option.directive';
import { DatoIconModule } from '../icon/icon.module';
import { DatoInputModule } from '../input/input.module';
import { DatoTriggerSingle } from './trigger-single/trigger-single.component';
import { DatoSelectActiveDirective } from './select-active.directive';
import { FilterPipe } from './filter.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoSelectEmptyComponent } from './select-empty.component';
import { DatoSelectLoadingComponent } from './select-loading.component';
import { DatoSelectOptionComponent } from './select-option.component';
import { GroupFilterPipe } from './group.pipe';
import { DatoSelectDropdownDirective } from './select-dropdown.directive';
import { DatoSelectGroupComponent } from './select-group.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

const publicApi = [DatoSelectComponent, DatoTriggerSingle, DatoSelectEmptyComponent, DatoSelectLoadingComponent, DatoSelectOptionComponent, DatoSelectGroupComponent];
const directives = [DatoOptionDirective, DatoSelectActiveDirective, DatoSelectDropdownDirective];

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, ScrollDispatchModule, DatoInputModule, DatoIconModule, ReactiveFormsModule],
  declarations: [publicApi, directives, FilterPipe, GroupFilterPipe],
  exports: [publicApi, directives],
  entryComponents: [publicApi]
})
export class DatoSelectModule {}
