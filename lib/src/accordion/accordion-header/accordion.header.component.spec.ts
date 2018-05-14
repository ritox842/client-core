/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAccordionHeaderComponent } from './accordion-header.component';
import { Observable } from 'rxjs/Observable';

describe('DatoAccordionHeaderComponent', () => {
  let host: SpectatorWithHost<DatoAccordionHeaderComponent>;

  const createHost = createHostComponentFactory<DatoAccordionHeaderComponent>(DatoAccordionHeaderComponent);

  it('should exists', () => {
    host = createHost(`<dato-accordion-header></dato-accordion-header>`);
    expect(host.element).toBeDefined();
  });

  it('should display the header', () => {
    host = createHost(`<dato-accordion-header>Header</dato-accordion-header>`);
    expect(host.element).toHaveText('Header');
  });

  it('should toggle class based on the expanded @Input()', () => {
    host = createHost(`<dato-accordion-header [expanded]="true">Header</dato-accordion-header>`);
    expect(host.element).toHaveClass('dato-accordion-open');
    host.setInput('expanded', false);
    host.hostFixture.detectChanges();
    expect(host.element).not.toHaveClass('dato-accordion-open');
  });

  it('should expose click$ observable', () => {
    host = createHost(`<dato-accordion-header>Header</dato-accordion-header>`);
    expect(host.component.click$).toEqual(jasmine.any(Observable));
  });
});
