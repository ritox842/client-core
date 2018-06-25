/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAccordionContentComponent } from './accordion-content.component';

describe('DatoAccordionContentComponent', () => {
  let host: SpectatorWithHost<DatoAccordionContentComponent>;

  const createHost = createHostComponentFactory<DatoAccordionContentComponent>(DatoAccordionContentComponent);

  it('should exists', () => {
    host = createHost(`<dato-accordion-content></dato-accordion-content>`);
    expect(host.element).toBeDefined();
  });

  it('should display the content', () => {
    host = createHost(`<dato-accordion-content [expanded]="true">Content</dato-accordion-content>`);
    expect(host.element).toHaveText('Content');
  });

  it('should toggle class based on the expanded @Input()', () => {
    host = createHost(`<dato-accordion-content [expanded]="true">Content</dato-accordion-content>`);
    expect(host.query('div')).toExist();
    host.setInput('expanded', false);
    expect(host.query('div')).not.toExist();
  });
});
