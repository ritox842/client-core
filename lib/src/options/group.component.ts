/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'dato-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DatoGroupComponent implements OnInit {
  @HostBinding('class.force-hide') _hidden = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detach();
  }
}
