import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { Component } from '@angular/core';
import { DatoCheckboxComponent } from './checkbox.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatoDirectivesModule } from '../directives/directives.module';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  control = new FormControl();
}

describe('DatoCheckboxComponent', () => {
  let host: SpectatorWithHost<DatoCheckboxComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoCheckboxComponent,
    imports: [ReactiveFormsModule, DatoDirectivesModule],
    host: CustomHostComponent
  });

  it('should be define', () => {
    host = createHost(`<dato-checkbox [formControl]="control"></dato-checkbox>`);
    expect(host.query('input')).toExist();
  });

  it('should not be checked', () => {
    host = createHost(`<dato-checkbox [formControl]="control"></dato-checkbox>`);
    expect(host.query('input')).not.toBeChecked();
  });

  it('should be checked', () => {
    host = createHost(`<dato-checkbox [formControl]="control"></dato-checkbox>`);
    host.hostComponent.control.patchValue(true);
    expect(host.query('input')).toBeChecked();
  });

  it('should support custom truthy value', () => {
    host = createHost(`<dato-checkbox [formControl]="control" trueValue="yeah" falseValue="nope"></dato-checkbox>`);
    host.hostComponent.control.patchValue('yeah');
    expect(host.query('input')).toBeChecked();
  });

  it('should support custom falsy value', () => {
    host = createHost(`<dato-checkbox [formControl]="control" trueValue="yeah" falseValue="nope"></dato-checkbox>`);
    host.hostComponent.control.patchValue('nope');
    expect(host.query('input')).not.toBeChecked();
    host.hostComponent.control.patchValue('yeah');
    expect(host.query('input')).toBeChecked();
  });

  it('should be disabled', () => {
    host = createHost(`<dato-checkbox [formControl]="control"></dato-checkbox>`);
    host.hostComponent.control.disable();
    expect(host.query('input')).toBeDisabled();
  });

  it('should have checkmark', () => {
    host = createHost(`<dato-checkbox [formControl]="control"></dato-checkbox>`);
    expect(host.query('.checkmark')).toExist();
  });
});
