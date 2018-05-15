import { Renderer2 } from '@angular/core';

export function setDimensions(width: string, height: string, element: Element, renderer: Renderer2) {
  if (width) {
    renderer.setStyle(element, 'width', width);
  }
  if (height) {
    renderer.setStyle(element, 'height', height);
  }
}
