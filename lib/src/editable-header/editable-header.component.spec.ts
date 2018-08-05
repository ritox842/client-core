import { createHostComponentFactory, SpectatorWithHost, typeInElement } from '@netbasal/spectator';
import { Component } from '@angular/core';
import { DatoEditableHeaderComponent } from './editable-header.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  control = new FormControl('Title');
}

describe('DatoEditableHeaderComponent', () => {
  let host: SpectatorWithHost<DatoEditableHeaderComponent, CustomHostComponent>;
  let input: HTMLInputElement;

  const createHost = createHostComponentFactory({
    component: DatoEditableHeaderComponent,
    imports: [ReactiveFormsModule],
    host: CustomHostComponent
  });

  beforeEach(() => {
    host = createHost(`<dato-editable-header [formControl]="control"></dato-editable-header>`);
    input = host.query('input') as HTMLInputElement;
  });

  it('should display the title', () => {
    expect(input).toHaveValue('Title');
  });

  it('should update the control', () => {
    typeInElement('Changed', input);
    expect(host.hostComponent.control.value).toBe('Changed');
  });

  it('should revert the value on empty + blur', () => {
    host.typeInElement('', input);
    host.dispatchFakeEvent(input, 'blur');
    expect(input).toHaveValue('Title');
  });

  it('should revert the value on empty + escape', () => {
    host.typeInElement('Changed', input);
    host.keyboard.pressEscape(input);
    expect(input).toHaveValue('Title');
  });

  it('should select the text on focus', () => {
    spyOn(input, 'setSelectionRange');
    host.dispatchFakeEvent(input, 'focus');
    expect(input.setSelectionRange).toHaveBeenCalledTimes(1);
  });

  it('should set the appropriate styles when the value does not changed', () => {
    expect(input).toHaveStyle({
      fontStyle: 'italic'
    });
  });

  it('should set the appropriate styles when the value changed', () => {
    host.typeInElement('Changed', input);
    expect(input).toHaveStyle({
      fontStyle: 'normal'
    });
    host.typeInElement('Title', input);
    expect(input).toHaveStyle({
      fontStyle: 'italic'
    });
    expect(host.hostComponent.control.value).toBe('Title');
  });
});

describe('Standalone', () => {
  const createHost = createHostComponentFactory({
    component: DatoEditableHeaderComponent,
    imports: [ReactiveFormsModule],
    host: CustomHostComponent
  });

  it('should support standalone', () => {
    const { element } = createHost(`<dato-editable-header [formControl]="control" standalone="true"></dato-editable-header>`);
    expect(element).toHaveClass('standalone');
  });
});
