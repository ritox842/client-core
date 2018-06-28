/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoListComponent implements OnInit, OnDestroy {
  @Input() search: FormControl;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  action() {}
}
