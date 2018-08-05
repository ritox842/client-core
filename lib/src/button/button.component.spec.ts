import { DatoButtonComponent } from './button.component';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { Component } from '@angular/core';

describe('DatoButtonComponent', () => {
  let host: SpectatorWithHost<DatoButtonComponent>;

  const createHost = createHostComponentFactory(DatoButtonComponent);

  it('should create', () => {
    host = createHost(`<dato-button>Click</dato-button>`);

    expect(host.component).toBeDefined();
  });

  it('should render the text', () => {
    host = createHost(`<dato-button>Click</dato-button>`);

    expect(host.query('button')).toHaveText('Click');
  });

  it('should be disabled', () => {
    host = createHost(`<dato-button [disabled]="true">Click</dato-button>`);
    const button = host.query('button') as HTMLButtonElement;
    expect(button).toBeDisabled();
  });
});

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  click() {}
}

describe('DatoButtonComponent', () => {
  let host: SpectatorWithHost<DatoButtonComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoButtonComponent,
    host: CustomHostComponent
  });

  it('should not invoke the callback when disabled', () => {
    host = createHost(`<dato-button [disabled]="true" (click)="click()">Click</dato-button>`);
    spyOn(host.hostComponent, 'click');
    host.hostElement.click();
    expect(host.hostComponent.click).not.toHaveBeenCalled();
  });
});
