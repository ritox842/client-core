/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Attribute, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { kebabCase } from '@datorama/utils';
import { IconRegistry } from '../services/icon-registry';
import { setDimensions } from '../internal/custom-dimensions';
import { DatoCoreError } from '../errors';

function assertIconExists(datoIcon) {
  throw new DatoCoreError(`${datoIcon} Icon - does not exists, did you misspell it?`);
}

@Component({
  selector: 'dato-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoIconComponent implements OnInit {
  private iconKey: string;
  private lastIconClass: string;

  @Input()
  set datoIcon(iconKey: string) {
    const iconChanged = this.iconKey && this.iconKey !== iconKey;
    this.iconKey = iconKey;
    /** inject the changed icon */
    if (iconChanged) {
      this.injectSvg();
    }
  }

  get datoIcon(): string {
    return this.iconKey;
  }

  constructor(private host: ElementRef, private iconRegistry: IconRegistry, private renderer: Renderer2, @Attribute('width') public width, @Attribute('height') public height) {}

  ngOnInit() {
    /** Add standard attributes */
    this.renderer.setAttribute(this.element, 'role', 'img');

    setDimensions(this.width, this.height, this.element, this.renderer);

    this.injectSvg();
  }

  get element() {
    return this.host.nativeElement;
  }

  private injectSvg() {
    if (this.datoIcon && this.iconRegistry.hasSvg(this.datoIcon)) {
      const svg = this.iconRegistry.getSvg(this.datoIcon);

      this.element.innerHTML = svg;
      if (this.lastIconClass) {
        this.renderer.removeClass(this.element, this.lastIconClass);
      }
      /** append a CSS class, so developers can apply different styles to the icon */
      this.lastIconClass = this.getIconClass();
      this.renderer.addClass(this.element, this.lastIconClass);
    } else {
      assertIconExists(this.datoIcon);
    }
  }

  private getIconClass(): string {
    return kebabCase(`dato-icon-${this.datoIcon}`);
  }
}
