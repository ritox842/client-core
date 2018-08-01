/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAccordionGroupComponent } from './accordion-group.component';
import { DatoAccordionContentComponent } from '../accordion-content/accordion-content.component';
import { DatoAccordionHeaderComponent } from '../accordion-header/accordion-header.component';
import { EventEmitter } from '@angular/core';
import { DatoIconModule, IconRegistry } from '../../../';

describe('DatoAccordionGroupComponent', () => {
  let host: SpectatorWithHost<DatoAccordionGroupComponent>;
  let createHost = createHostComponentFactory<DatoAccordionGroupComponent>({
    component: DatoAccordionGroupComponent,
    declarations: [DatoAccordionContentComponent, DatoAccordionHeaderComponent],
    imports: [DatoIconModule],
    providers: [IconRegistry]
  });

  it('should exists', () => {
    host = createHost(`<dato-accordion-group></dato-accordion-group>`);
    expect(host.element).toExist();
  });

  it('should should have header', () => {
    host = createHost(`
      <dato-accordion-group>
        <dato-accordion-header>Header</dato-accordion-header>
      </dato-accordion-group>`);
    expect(host.component.header).toBeDefined();
  });

  it('should should have content', () => {
    host = createHost(`
      <dato-accordion-group>
        <dato-accordion-content>Content</dato-accordion-content>
      </dato-accordion-group>`);
    expect(host.component.content).toBeDefined();
  });

  it('should have toggle @Output()', () => {
    host = createHost(`<dato-accordion-group></dato-accordion-group>`);
    expect(host.component.toggle).toEqual(jasmine.any(EventEmitter));
  });
});
