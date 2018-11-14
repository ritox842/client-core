import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, TemplateRef } from '@angular/core';
import Tooltip from 'tooltip.js';
import { fromEvent, Subscription } from 'rxjs';
import { DatoTemplatePortal } from '../angular/overlay';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { IconRegistry } from '../services/icon-registry';
import { default as Popper } from 'popper.js';
import { isNil } from '@datorama/utils';
import { TooltipOptions, TooltipTrigger } from './tooltip.model';
import { zIndex } from '../internal/z-index';

@Directive({
  selector: '[datoTooltip]',
  exportAs: 'datoTooltip'
})
export class DatoTooltipDirective implements OnDestroy, AfterViewInit {
  @Input()
  datoTooltipType: 'tooltip' | 'long' = 'tooltip';

  @Input()
  set datoTooltip(content: string | TemplateRef<any>) {
    if (content instanceof TemplateRef) {
      if (this.tplPortal) {
        this.tplPortal.destroy();
      }
      this.tplPortal = new DatoTemplatePortal(content);
      this.tplPortal.viewRef.detectChanges();
      this.content = this.tplPortal.elementRef;
    } else {
      this.content = content;
    }

    if (this.tooltip) {
      this.hide();
    }

    if (this.viewInit) {
      this.unsubscribe();
      this.initTooltip();
    }
  }

  @Input()
  datoTooltipPosition: Popper.Placement = 'top';
  @Input()
  datoTooltipDelay = 0;
  @Input()
  datoTooltipClass = '';
  @Input()
  datoTooltipOnTextOverflow = false;
  @Input()
  datoTooltipOverflowElement: ElementRef = null;
  @Input()
  datoTooltipDisabled = false;
  @Input()
  datoTooltipOverflow = false;
  @Input()
  datoTooltipOffset: string | number;
  @Input()
  datoIsManual = false;
  @Input()
  datoTooltipTrigger: TooltipTrigger = 'hover';

  private viewInit = false;
  private tooltip;
  private content: string | HTMLElement;
  private tplPortal: DatoTemplatePortal;
  private triggerOn: Subscription;
  private triggerOff: Subscription;
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

  get isOpen(): boolean {
    return !isNil(this.tooltip);
  }

  get tooltipElement(): HTMLElement {
    return this.datoTooltipOverflowElement || this.host.nativeElement;
  }

  constructor(private host: ElementRef, private iconRegistry: IconRegistry) {}

  ngAfterViewInit() {
    this.viewInit = true;

    if (this.datoTooltipTrigger === 'manual') {
      return;
    }

    this.initTooltip();
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
    }
  }

  private get isLongTooltip(): boolean {
    return this.datoTooltipType === 'long';
  }

  private createTooltipInstance(container: HTMLElement) {
    const xIcon = `<div class="tooltip-close-icon">${this.iconRegistry.getSvg('close')}</div>`;
    const tooltipOptions: TooltipOptions = {
      placement: this.datoTooltipPosition,
      container: document.body,
      title: this.content,
      html: true,
      offset: !isNil(this.datoTooltipOffset) ? this.datoTooltipOffset : this.isLongTooltip ? '0 10' : 0, // 0 10 => x y
      trigger: 'manual',
      delay: this.datoTooltipDelay,
      template: this.getTpl(xIcon)
    };
    if (this.datoTooltipOverflow || !isNil(this.datoTooltipOffset)) {
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
    return `<div class="tooltip dato-tooltip ${this.isLongTooltip ? '' : 'common-tooltip'} ${this.datoTooltipClass} ${this.datoTooltipPosition}" 
                 role="tooltip" style="z-index: ${zIndex.tooltip}">
                  ${this.isLongTooltip ? '<div class="tooltip-arrow show"></div>' : ''}
                  <div class="tooltip-content">
                    <div class="tooltip-inner"></div>
                    ${this.isLongTooltip && this.datoTooltipTrigger === 'click' ? xIcon : ''}
                 </div>
                </div>`;
  }

  private initTooltip() {
    const { on, off } = this.eventsMap[this.datoTooltipTrigger];

    if (this.datoTooltipOnTextOverflow && !this.isElementOverflow(this.tooltipElement)) return;

    this.triggerOn = fromEvent(this.host.nativeElement, on)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.datoTooltipDisabled) return;

        if (this.datoTooltipTrigger === 'click') {
          if (!this.isOpen) {
            this.show();
          } else {
            this.hide();
          }
        } else {
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
      this.triggerOff = fromEvent(this.host.nativeElement, off)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.hide();
        });
    }
  }

  private unsubscribe() {
    if (this.triggerOn) {
      this.triggerOn.unsubscribe();
    }

    if (this.triggerOff) {
      this.triggerOff.unsubscribe();
    }
  }
}
