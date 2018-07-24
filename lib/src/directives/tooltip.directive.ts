import { Directive, ElementRef, Input, OnDestroy, TemplateRef } from '@angular/core';
import Tooltip from 'tooltip.js';
import { fromEvent } from 'rxjs';
import { DatoTemplatePortal } from '../angular/overlay';
import { TakeUntilDestroy, untilDestroyed } from 'ngx-take-until-destroy';
import { IconRegistry } from '../services/icon-registry';
import { default as Popper } from 'popper.js';

@TakeUntilDestroy()
@Directive({
  selector: '[datoTooltip]'
})
export class DatoTooltipDirective implements OnDestroy {
  @Input() datoTooltipType: 'tooltip' | 'long' = 'tooltip';

  @Input()
  set datoTooltip(content: string | TemplateRef<any>) {
    if (content instanceof TemplateRef) {
      if (this.tplPortal) {
        this.tplPortal.destroy();
      }
      this.tplPortal = new DatoTemplatePortal(content);
      this.content = this.tplPortal.elementRef;
    } else {
      this.content = content;
    }
  }

  @Input() datoTooltipPosition: Popper.Placement = 'top';
  @Input() datoTooltipDelay = 0;
  @Input() datoTooltipClass = '';
  @Input() datoTooltipOnOverflow = false;
  @Input() datoTooltipDisabled = false;
  @Input() datoTooltipTrigger: 'click' | 'hover' | 'focus' = 'hover';

  private content: string | HTMLElement;
  private tplPortal: DatoTemplatePortal;
  private eventsMap = {
    hover: {
      on: 'mouseenter',
      off: 'mouseleave'
    },
    focus: {
      on: 'focusin',
      off: 'focusout'
    },
    click: {
      on: 'click',
      off: 'click'
    }
  };
  private isOpen = false;
  private tooltip;

  constructor(private host: ElementRef, private iconRegistry: IconRegistry) {}

  ngAfterContentInit() {
    const { on, off } = this.eventsMap[this.datoTooltipTrigger];

    if (this.datoTooltipOnOverflow && !this.isElementOverflow(this.host.nativeElement)) return;

    fromEvent(this.host.nativeElement, on)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.datoTooltipDisabled) return;

        if (this.datoTooltipTrigger === 'click') {
          this.isOpen = !this.isOpen;
          if (this.isOpen) {
            this.showTootltip();
          } else {
            this.destroy();
          }
        } else {
          this.isOpen = true;
          this.showTootltip();
        }

        if (this.isLongTooltip && this.isOpen) {
          const closeButton = this.tooltip.popperInstance.popper.querySelector('.tooltip-close-icon svg');
          if (closeButton) {
            fromEvent(closeButton, 'click')
              .pipe(untilDestroyed(this))
              .subscribe(() => this.destroy());
          }
        }
      });

    if (this.datoTooltipTrigger !== 'click') {
      fromEvent(this.host.nativeElement, off)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.destroy();
        });
    }
  }

  ngOnDestroy() {
    this.destroy();
    if (this.tplPortal) {
      this.tplPortal.destroy();
    }
  }

  showTootltip() {
    if (this.tooltip) return;
    this.tooltip = this.createTooltipInstance(this.host.nativeElement).show();
  }

  private get isLongTooltip() {
    return this.datoTooltipType === 'long';
  }

  /**
   *
   * @param {Node | null} parentNode
   * @returns {}
   */
  private createTooltipInstance(container: HTMLElement) {
    const xIcon = `<div class="tooltip-close-icon">${this.iconRegistry.getSvg('close')}</div>`;

    return new Tooltip(container, {
      placement: this.datoTooltipPosition,
      container: document.body,
      title: this.content,
      html: true,
      offset: this.isLongTooltip ? '0 10' : 0, // 0 10 => x y
      trigger: this.datoTooltipTrigger,
      delay: this.datoTooltipDelay,
      template: this.getTpl(xIcon)
    });
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  private isElementOverflow(element: HTMLElement): boolean {
    const parentEl = element.parentElement;

    const parentTest: boolean = element.offsetWidth > parentEl.offsetWidth;
    const elementTest: boolean = element.offsetWidth < element.scrollWidth;

    return parentTest || elementTest;
  }

  private destroy() {
    if (this.tooltip) {
      this.tooltip.dispose();
      this.tooltip = null;
      this.isOpen = false;
    }
  }

  private getTpl(xIcon) {
    return `<div class="tooltip dato-tooltip ${this.isLongTooltip ? '' : 'common-tooltip'} ${this.datoTooltipClass} ${this.datoTooltipPosition}" role="tooltip">
                  <div class="tooltip-arrow ${this.isLongTooltip ? 'show' : ''}"></div>
                  <div class="tooltip-content">
                    <div class="tooltip-inner"></div>
                    ${this.isLongTooltip && this.datoTooltipTrigger === 'click' ? xIcon : ''}
                 </div>
                </div>`;
  }
}
