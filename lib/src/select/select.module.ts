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
import { DatoIconModule } from '../icon/icon.module';
import { DatoInputModule } from '../input/input.module';
import { DatoTriggerSingle } from './trigger-single/trigger-single.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoSelectEmptyComponent } from './select-empty.component';
import { DatoSelectActiveDirective } from './select-active.directive';
import { DatoCheckboxModule } from '../checkbox/checkbox.module';
import { DatoButtonModule } from '../button/button.module';
import { DatoLinkButtonModule } from '../link-button/link-button.module';
import { DatoTextModule } from '../text/text.module';
import { DatoTriggerMulti } from './trigger-multi/trigger-multi.component';
import { DatoOptionsModule } from '../options/options.module';
import { DatoDirectivesModule } from '../directives/directives.module';

const publicApi = [DatoSelectComponent, DatoTriggerSingle, DatoSelectEmptyComponent, DatoTriggerMulti];
const directives = [DatoSelectActiveDirective];

@NgModule({
  imports: [CommonModule, DatoInputModule, DatoIconModule, ReactiveFormsModule, DatoCheckboxModule, DatoButtonModule, DatoLinkButtonModule, DatoTextModule, DatoOptionsModule, DatoDirectivesModule],
  declarations: [publicApi, directives],
  exports: [publicApi, directives],
  entryComponents: [publicApi]
})
export class DatoSelectModule {}
