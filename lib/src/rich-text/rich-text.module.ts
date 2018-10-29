/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';
import { DatoRichTextDirective } from './rich-text.directive';
import { HttpClientModule } from '@angular/common/http';

const publicApi = [DatoRichTextDirective];

@NgModule({
  imports: [HttpClientModule],
  declarations: [publicApi],
  exports: [publicApi]
})
export class DatoRichTextModule {}
