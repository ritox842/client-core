/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-list-preview",
  templateUrl: "./list-preview.component.html",
  styleUrls: ["./list-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPreviewComponent implements OnInit, OnDestroy {
  search = new FormControl();

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
