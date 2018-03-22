import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { kebabCase } from '@datorama/utils';
import { IconRegistry } from '../services/icon-registry';

@Component({
  selector: 'dato-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoIconComponent implements OnInit {
  private iconKey: string;

  @Input()
  set datoIcon(iconKey: string) {
    const iconChanged = this.iconKey && this.iconKey !== iconKey;
    this.iconKey = iconKey;

    // inject the changed icon
    if (iconChanged) {
      this.injectSvg();
    }
  }

  get datoIcon(): string {
    return this.iconKey;
  }

  constructor(private host: ElementRef,
    private iconRegistry: IconRegistry,
    private renderer: Renderer2) {}

  ngOnInit() {
    // add standard attributes
    this.renderer.setAttribute(this.element, 'role', 'img');

    this.injectSvg();
  }

  get element() {
    return this.host.nativeElement;
  }

  private injectSvg() {
    if (this.datoIcon && this.iconRegistry.hasSvg(this.datoIcon)) {
      const svg = this.iconRegistry.getSvg(this.datoIcon);
      this.element.innerHTML = svg;

      // append a CSS class, so developers can apply different styles to the icon
      this.renderer.addClass(this.element, this.getIconClass());
    } else {
      console.error(`'${this.datoIcon}' Icon - does not exists, did you misspell it?`);
    }
  }

  private getIconClass(): string {
    return kebabCase(`dato-icon-${this.datoIcon}`);
  }
}
