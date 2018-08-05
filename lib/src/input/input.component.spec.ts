import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { Component } from '@angular/core';
import { DatoInputComponent } from './input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatoDirectivesModule } from '../directives/directives.module';
import { DatoIconModule } from '../icon/icon.module';
import { IconRegistry } from '../..';
import { fakeAsync, tick } from '@angular/core/testing';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  control = new FormControl();
}

describe('DatoInputComponent', () => {
  let host: SpectatorWithHost<DatoInputComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoInputComponent,
    providers: [IconRegistry],
    imports: [ReactiveFormsModule, DatoDirectivesModule, DatoIconModule],
    host: CustomHostComponent
  });

  describe('Dimensions', () => {
    it('should support custom width', function() {
      host = createHost(`<dato-input [formControl]="control" width="200px"></dato-input>`);
      expect(host.query('input')).toHaveStyle({ width: '200px' });
    });

    it('should support custom height', function() {
      host = createHost(`<dato-input [formControl]="control" height="50px"></dato-input>`);
      expect(host.element).toHaveStyle({ height: '50px' });
      expect(host.query('input')).toHaveStyle({ height: '50px' });
    });
  });

  it('should support placeholder', function() {
    host = createHost(`<dato-input [formControl]="control" placeholder="Search"></dato-input>`);
    expect(host.query('input')).toHaveAttr({ attr: 'placeholder', val: 'Search' });
  });

  it(
    'should support autofocus',
    fakeAsync(() => {
      host = createHost(`<dato-input [formControl]="control" [isFocused]="true"></dato-input>`);
      tick(0);
      expect(host.query('input')).toBeFocused();
    })
  );

  it('should update the control', () => {
    host = createHost(`<dato-input [formControl]="control"></dato-input>`);
    host.typeInElement('hello', 'input');
    expect(host.hostComponent.control.value).toBe('hello');
  });

  it('should be disable', () => {
    host = createHost(`<dato-input [formControl]="control" [isDisabled]="true"></dato-input>`);
    expect(host.query('input')).toBeDisabled();
  });

  it('should add search icon', () => {
    host = createHost(`<dato-input [formControl]="control" type="search"></dato-input>`);
    expect(host.query('.dato-icon-datosearch')).toExist();
  });

  it('should add delete icon', () => {
    host = createHost(`<dato-input [formControl]="control" type="search"></dato-input>`);
    host.typeInElement('hello', 'input');
    expect(host.query('.dato-icon-close')).toExist();
  });

  it('should hide delete icon', () => {
    host = createHost(`<dato-input [formControl]="control" type="search"></dato-input>`);
    host.typeInElement('hello', 'input');
    expect(host.query('.dato-icon-close')).toExist();
    host.typeInElement('', 'input');
    expect(host.query('.dato-icon-close')).not.toExist();
  });

  it('should delete the value', () => {
    host = createHost(`<dato-input [formControl]="control" type="search"></dato-input>`);
    host.typeInElement('hello', 'input');
    host.click('.dato-icon-close');
    expect(host.hostComponent.control.value).toBe('');
    expect(host.query('input')).toHaveValue('');
  });

  it(
    'should support debounce',
    fakeAsync(() => {
      host = createHost(`<dato-input [formControl]="control" [debounceTime]="300"></dato-input>`);
      host.typeInElement('hello', 'input');
      tick(300);
      expect(host.hostComponent.control.value).toBe('hello');
      expect(host.query('input')).toHaveValue('hello');
    })
  );
});
