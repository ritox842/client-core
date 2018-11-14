import { Component, forwardRef, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EXPANDED_SPAN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SpanExpandedComponent),
  multi: true
};

@Component({
  selector: 'span-expanded',
  providers: [EXPANDED_SPAN_VALUE_ACCESSOR],
  template: `
    <span contenteditable="true" #span tabindex="1" (input)="change($event)"></span>
  `
})
export class SpanExpandedComponent implements ControlValueAccessor {
  @ViewChild('span')
  span;

  onChange;
  onTouched;

  writeValue(value: any): void {
    const span = this.span.nativeElement;
    this.renderer.setProperty(span, 'textContent', value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  constructor(private renderer: Renderer2) {}

  change($event) {
    this.onChange($event.target.textContent);
    this.onTouched($event.target.textContent);
  }
}
