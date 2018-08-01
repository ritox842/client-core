import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { Component } from '@angular/core';
import { DatoDynamicContentComponent } from './dynamic-content.component';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {}

describe('DatoDynamicContentComponent', () => {
  let host: SpectatorWithHost<DatoDynamicContentComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoDynamicContentComponent,
    imports: [],
    host: CustomHostComponent
  });
});
