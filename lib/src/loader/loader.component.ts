/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'dato-loader',
  templateUrl: './loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoLoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
