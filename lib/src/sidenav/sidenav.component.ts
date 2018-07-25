/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { DatoSidenav } from './sidenav.service';

@Component({
  selector: 'dato-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoSidenavComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef })
  container;

  @Input() right = false;

  constructor(private datoSidebar: DatoSidenav) {}

  ngOnInit() {
    this.datoSidebar._registerContainer(this.right ? 'right' : 'left', this.container);
  }

  ngOnDestroy() {}
}
