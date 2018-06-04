import Popper, { PopperOptions } from 'popper.js';
import { ApplicationRef, EmbeddedViewRef, TemplateRef } from '@angular/core';
import { DatoCoreError } from '../errors';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

export class DatoOverlay {
  private overlay: HTMLElement;
  private popper: Popper;
  private attached = false;
  private onClickSubscription: Subscription;
  private backDropClick = new Subject();

  constructor(private origin: HTMLElement, private tplPortal: DatoTemplatePortal) {}

  /**
   *
   * @param {Partial<PopperOptions>} options
   */
  create(options: Partial<PopperOptions>, appRef: ApplicationRef) {
    appRef.attachView(this.tplPortal.viewRef);
    this.createPopper(this.createOverlay(), options);
    this.attached = true;
    this.onClickSubscription = fromEvent(document.body, 'click', { capture: true }).subscribe(this.handleClick.bind(this));
  }

  get backDropClick$() {
    return this.backDropClick.asObservable();
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as Node;
    if (this.origin.contains(target) === false && this.overlay.contains(target) === false) {
      this.backDropClick.next(event);
    }
  }

  /**
   *
   * @returns {HTMLElement}
   */
  private createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.classList.add('dato-overlay');
    this.overlay.appendChild(this.tplPortal.elementRef);
    document.body.appendChild(this.overlay);
    return this.overlay;
  }

  /**
   *
   * @param {HTMLElement} target
   * @param {Partial<PopperOptions>} options
   */
  private createPopper(target: HTMLElement, options: Partial<PopperOptions>) {
    /** TODO: Run outside Angular Zone */
    this.popper = new Popper(this.origin, target, options);
    this.popper.scheduleUpdate();
  }

  /**
   * Call this method when you close the dropdown
   */
  detach() {
    this.popper.destroy();
    this.attached = false;
  }

  /**
   * Call this method on ngOnDestroy of the component
   */
  destroy() {
    if (this.attached) {
      this.popper.options.removeOnDestroy = true;
    }
    this.popper.destroy();
    this.onClickSubscription && this.onClickSubscription.unsubscribe();
  }
}

export class DatoTemplatePortal {
  viewRef: EmbeddedViewRef<any>;

  constructor(tpl: TemplateRef<any>) {
    assertTemplateRef(tpl);
    this.viewRef = tpl.createEmbeddedView({});
  }

  /**
   *
   * @returns {HTMLElement}
   */
  get elementRef() {
    return this.viewRef.rootNodes[0] as HTMLElement;
  }

  /**
   * Destroy the viewRef
   */
  destroy() {
    this.viewRef.destroy();
  }
}

/**
 *
 * @param {TemplateRef<any>} tpl
 */
function assertTemplateRef(tpl: TemplateRef<any>) {
  if (tpl instanceof TemplateRef === false) {
    throw new DatoCoreError(`Expect TemplateRef but got ${typeof tpl}`);
  }
}
