import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

export const enum Palette {
  LIGHT = 'light',
  Dark = 'dark'
}

@Directive({
  selector: '[datoPalette]'
})
export class PaletteDirective {
  /**
   *  Will change the palette on the container to dark/light.
   */
  @Input()
  set datoPalette(palette: Palette) {
    this.renderer.addClass(this.host.nativeElement, palette || Palette.LIGHT);
  }

  constructor(private renderer: Renderer2, private host: ElementRef) {}
}
