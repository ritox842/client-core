/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterViewInit, Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'dato-link',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoLinkButtonComponent implements AfterViewInit {
  /** Whether the button is disabled */
  @Input() disabled = false;

  constructor(private renderer: Renderer2, private host: ElementRef, @Attribute('target') public target, @Attribute('href') public href) {}

  ngAfterViewInit() {
    if (this.target) {
      this.renderer.setAttribute(this.linkElement, 'target', this.target);
    }

    if (this.href) {
      this.renderer.setAttribute(this.linkElement, 'href', this.href);
    }
  }

  get linkElement() {
    return this.host.nativeElement.querySelector('a');
  }
}
