/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'dato-sortable',
  templateUrl: './sortable.component.html',
  styleUrls: ['./sortable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatoSortableComponent implements OnInit, OnDestroy {
  @Input() datoList = [];
  @Input() datoOptions: SortablejsOptions = {};

  private defaultOptions: SortablejsOptions = {
    handle: '.dato-sortable-handler',
    ghostClass: 'dato-sortable-ghost',
    chosenClass: 'dato-sortable-chosen',
    dragClass: 'dato-sortable-drag'
  };

  constructor() {}

  ngOnInit() {
    this.datoOptions = { ...this.defaultOptions, ...this.datoOptions };
  }

  ngOnDestroy() {}
}
