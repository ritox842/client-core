import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, TemplateRef } from '@angular/core';
import Tooltip from 'tooltip.js';
import { fromEvent } from 'rxjs';
import { DatoTemplatePortal } from '../angular/overlay';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { IconRegistry } from '../services/icon-registry';
import { default as Popper } from 'popper.js';
import { toBoolean } from '@datorama/utils';
import { TooltipOptions, TooltipTrigger } from './tooltip.model';

@Directive({
  selector: '[datoTooltip]',
  exportAs: 'datoTooltip'
})
export class DatoTooltipDirective implements OnDestroy, AfterViewInit {
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

    if (this.tooltip) {
      this.hide();
    }
  }

  @Input() datoTooltipPosition: Popper.Placement = 'top';
  @Input() datoTooltipDelay = 0;
  @Input() datoTooltipClass = '';
  @Input() datoTooltipOnTextOverflow = false;
  @Input() datoTooltipDisabled = false;
  @Input() datoTooltipOverflow = false;
  @Input() datoTooltipOffset;
  @Input() datoIsManual = false;
  @Input() datoTooltipTrigger: TooltipTrigger = 'hover';
  @Input() datoTooltipTarget: ElementRef = null;

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

  get tooltipElement(): HTMLElement {
    return this.datoTooltipTarget || this.host.nativeElement;
  }

  constructor(private host: ElementRef, private iconRegistry: IconRegistry) {}

  ngAfterViewInit() {
    if (this.datoTooltipTrigger === 'manual') {
      return;
    }

    const { on, off } = this.eventsMap[this.datoTooltipTrigger];

    if (this.datoTooltipOnTextOverflow && !this.isElementOverflow(this.tooltipElement)) return;

    fromEvent(this.host.nativeElement, on)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.datoTooltipDisabled) return;

        if (this.datoTooltipTrigger === 'click') {
          this.isOpen = !this.isOpen;
          if (this.isOpen) {
            this.show();
          } else {
            this.hide();
          }
        } else {
          this.isOpen = true;
          this.show();
        }

        if (this.isLongTooltip && this.isOpen) {
          const closeButton = this.tooltip.popperInstance.popper.querySelector('.tooltip-close-icon svg');
          if (closeButton) {
            fromEvent(closeButton, 'click')
              .pipe(untilDestroyed(this))
              .subscribe(() => this.hide());
          }
        }
      });

    if (this.datoTooltipTrigger !== 'click') {
      fromEvent(this.host.nativeElement, off)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.hide();
        });
    }
  }

  ngOnDestroy() {
    this.hide();
    if (this.tplPortal) {
      this.tplPortal.destroy();
    }
  }

  show() {
    if (this.tooltip) return;
    this.tooltip = this.createTooltipInstance(this.tooltipElement).show();
  }

  hide() {
    if (this.tooltip) {
      this.tooltip.dispose();
      this.tooltip = null;
      this.isOpen = false;
    }
  }

  private get isLongTooltip() {
    return this.datoTooltipType === 'long';
  }

  private createTooltipInstance(container: HTMLElement) {
    const xIcon = `<div class="tooltip-close-icon">${this.iconRegistry.getSvg('close')}</div>`;
    const tooltipOptions: TooltipOptions = {
      placement: this.datoTooltipPosition,
      container: document.body,
      title: this.content,
      html: true,
      offset: toBoolean(this.datoTooltipOffset) ? this.datoTooltipOffset : this.isLongTooltip ? '0 10' : 0, // 0 10 => x y
      trigger: 'manual',
      delay: this.datoTooltipDelay,
      template: this.getTpl(xIcon)
    };
    if (this.datoTooltipOverflow || toBoolean(this.datoTooltipOffset)) {
      tooltipOptions.popperOptions = {
        modifiers: {
          preventOverflow: { enabled: false }
        }
      };
    }
    return new Tooltip(container, tooltipOptions);
  }

  private isElementOverflow(element: HTMLElement): boolean {
    const parentEl = element.parentElement;

    const parentTest: boolean = element.offsetWidth > parentEl.offsetWidth;
    const elementTest: boolean = element.offsetWidth < element.scrollWidth;

    return parentTest || elementTest;
  }

  private getTpl(xIcon) {
    return `<div class="tooltip dato-tooltip ${this.isLongTooltip ? '' : 'common-tooltip'} ${this.datoTooltipClass} ${this.datoTooltipPosition}" role="tooltip">
                  ${this.isLongTooltip ? '<div class="tooltip-arrow show"></div>' : ''}
                  <div class="tooltip-content">
                    <div class="tooltip-inner"></div>
                    ${this.isLongTooltip && this.datoTooltipTrigger === 'click' ? xIcon : ''}
                 </div>
                </div>`;
  }
}
