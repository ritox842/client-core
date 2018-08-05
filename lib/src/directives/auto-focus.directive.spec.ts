import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoAutoFocusDirective } from './auto-focus.directive';
import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

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

  it(
    'should be focused',
    fakeAsync(() => {
      host = createHost(`<input datoAutoFocus="true">`);
      tick();
      expect(host.element).toBeFocused();
    })
  );

  it(
    'should NOT be focused',
    fakeAsync(() => {
      host = createHost(`<input [datoAutoFocus]="false">`);
      tick();
      expect(host.element).not.toBeFocused();
    })
  );

  it(
    'should work with dynamic input',
    fakeAsync(() => {
      host = createHost(`<input [datoAutoFocus]="isFocused">`);
      tick();
      expect(host.element).not.toBeFocused();
      host.hostComponent.isFocused = true;
      host.detectChanges();
      tick();
      expect(host.element).toBeFocused();
    })
  );
});
