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
import { DatoIconModule } from '../icon/icon.module';
import { DatoInputModule } from '../input/input.module';
import { DatoTriggerSingle } from './trigger-single/trigger-single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoSelectEmptyComponent } from './select-empty.component';
import { DatoSelectMultiOptionComponent } from './select-multi-option.component';
import { DatoSelectOptionComponent } from './select-option.component';
import { DatoSelectGroupComponent } from './select-group.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { DatoSelectActiveDirective } from './select-active.directive';
import { DatoCheckboxModule } from '../checkbox/checkbox.module';

const publicApi = [DatoSelectComponent, DatoTriggerSingle, DatoSelectEmptyComponent, DatoSelectOptionComponent, DatoSelectGroupComponent, DatoSelectMultiOptionComponent];
const directives = [DatoSelectActiveDirective];

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, ScrollDispatchModule, DatoInputModule, DatoIconModule, ReactiveFormsModule, DatoCheckboxModule],
  declarations: [publicApi, directives],
  exports: [publicApi, directives],
  entryComponents: [publicApi]
})
export class DatoSelectModule {}
