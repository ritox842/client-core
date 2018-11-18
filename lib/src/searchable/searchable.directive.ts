/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */
import { Directive, ElementRef, Input, Optional } from '@angular/core';
import { DatoSearchableContainerComponent } from './searchable-container.component';
import { DatoCoreError } from '../errors';

@Directive({
  selector: '[datoSearchable]'
})
export class DatoSearchableDirective {
  token = '';

  @Input()
  set datoSearchable(value: string) {
    this.token = value;
  }

  constructor(@Optional() private container: DatoSearchableContainerComponent, private host: ElementRef) {
    if (!container) {
      throw new DatoCoreError(`Missing <dato-searchable-container> wrapper component`);
    }
  }

  ngOnInit() {
    this.container.register(this);
  }

  hide() {
    this.host.nativeElement.classList.add('force-hide');
  }

  show() {
    this.host.nativeElement.classList.remove('force-hide');
  }

  ngOnDestroy() {
    this.container.unregister(this);
  }
}
