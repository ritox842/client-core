import {createHostComponentFactory, SpectatorWithHost} from '@netbasal/spectator';
import {Component} from '@angular/core';
import {DatoTogglerComponent} from "./toggler.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

const rootElement = '.dato-toggle';
const activeClass = 'dato-toggle--active';
const disabledClass = 'dato-toggle--disabled';

@Component({selector: 'custom-host', template: ''})
class CustomHostComponent {
  control = new FormControl(false);
}

describe('DatoTogglerComponent', function () {
  let host: SpectatorWithHost<DatoTogglerComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoTogglerComponent,
    imports: [ ReactiveFormsModule ],
    host: CustomHostComponent
  });

  beforeEach(() => {
    host = createHost(`<dato-toggler [formControl]="control">Toggle</dato-toggler>`);
  });

  it('should display the text', () => {
    expect(host.query('[datoFont]')).toHaveText('Toggle');
  });

  it('should be closed when the control is falsy', () => {
    expect(host.component.isActive).toBeFalsy();
    expect(host.query(rootElement)).not.toHaveClass(activeClass);
    expect(host.query(rootElement)).not.toHaveClass(disabledClass);
  });

  it('should be open when the control is truthy', () => {
    host.hostComponent.control.patchValue(true);
    host.detectComponentChanges();
    expect(host.component.isActive).toBeTruthy();
    expect(host.query(rootElement)).toHaveClass(activeClass);
    expect(host.query(rootElement)).not.toHaveClass(disabledClass);
  });

  it('should toggle', () => {
    expect(host.component.isActive).toBeFalsy();
    expect(host.query(rootElement)).not.toHaveClass(activeClass);
    expect(host.query(rootElement)).not.toHaveClass(disabledClass);
    host.click(rootElement);
    expect(host.component.isActive).toBeTruthy();
    expect(host.query(rootElement)).toHaveClass(activeClass);
    expect(host.query(rootElement)).not.toHaveClass(disabledClass);
    expect(host.hostComponent.control.value).toBeTruthy();
  });

  it('should be disabled when the control is disabled', () => {
    host.hostComponent.control.disable();
    host.detectComponentChanges();
    expect(host.component.isActive).toBeFalsy();
    expect(host.query(rootElement)).not.toHaveClass(activeClass);
    expect(host.query(rootElement)).toHaveClass(disabledClass);
  });

  it('should not toggle when the control is disabled', () => {
    host.hostComponent.control.disable();
    host.detectComponentChanges();
    host.click(rootElement);
    expect(host.query(rootElement)).toHaveClass(disabledClass);
    expect(host.component.isActive).toBeFalsy();
  });

});