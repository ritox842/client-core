import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAutoFocusDirective } from './auto-focus.directive';
import { Component } from '@angular/core';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  isFocused = false;
}

describe('DatoAutoFocusDirective', function() {
  let host: SpectatorWithHost<DatoAutoFocusDirective, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoAutoFocusDirective,
    host: CustomHostComponent
  });

  it('should be focused', () => {
    host = createHost(`<input datoAutoFocus="true">`);
    expect(host.element).toBeFocused();
  });

  it('should NOT be focused', () => {
    host = createHost(`<input [datoAutoFocus]="false">`);
    expect(host.element).not.toBeFocused();
  });

  it('should work with dynamic input', () => {
    host = createHost(`<input [datoAutoFocus]="isFocused">`);
    expect(host.element).not.toBeFocused();
    host.hostComponent.isFocused = true;
    host.detectChanges();
    expect(host.element).toBeFocused();
  });
});
