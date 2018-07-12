/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dato-list-preview",
  templateUrl: "./list-preview.component.html",
  styleUrls: ["./list-preview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ListPreviewComponent {
  simpleControl = new FormControl({ id: 2, label: "efg" });
  simpleNoGroupSearchControl = new FormControl({ id: 2, label: "efg" });
  accordionControl = new FormControl({ id: 2, label: "efg" });
  scrollingControl = new FormControl({ id: 2, label: "efg" });
  flattenedControl = new FormControl({ id: 2, label: "efg", group: "A" });

  options = [
    {
      label: "A",
      children: [
        { id: 1, label: "abc" },
        { id: 2, label: "efg" },
        { id: 3, label: "hij" }
      ]
    },
    {
      label: "B",
      children: [{ id: 4, label: "klm" }]
    },
    {
      label: "C",
      children: [{ id: 5, label: "nop" }]
    }
  ];
  longOptions = [
    {
      label: "A",
      children: [
        { id: 1, label: "abc" },
        { id: 2, label: "efg" },
        { id: 3, label: "hij" }
      ]
    },
    {
      label: "B",
      children: [{ id: 4, label: "klm" }]
    },
    {
      label: "C",
      children: [{ id: 5, label: "nop" }]
    },
    {
      label: "D",
      children: [{ id: 6, label: "qrs" }]
    },
    {
      label: "E",
      children: [{ id: 7, label: "tuv" }]
    },
    {
      label: "F",
      children: [{ id: 8, label: "wxyz" }]
    }
  ];
  flattenedOptions = [
    { id: 1, label: "abc", group: "A" },
    { id: 2, label: "efg", group: "A" },
    { id: 3, label: "hij", group: "A" },
    { id: 4, label: "klm", group: "B" },
    { id: 5, label: "nop", group: "C" }
  ];
}
