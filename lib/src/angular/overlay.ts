import Popper, { PopperOptions } from 'popper.js';
import { ApplicationRef, EmbeddedViewRef, Injectable, NgZone, TemplateRef } from '@angular/core';
import { DatoCoreError } from '../errors';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { addClass, appendChild, appendToBody, createElement } from '../internal/helpers';

@Injectable()
export class DatoOverlay {
  attached = false;
  created = false;
  private overlay: HTMLElement;
  private popper: Popper;
  private onClickSubscription;
  private backDropClick = new Subject();
  private origin: HTMLElement;
  private tplPortal: DatoTemplatePortal;

  constructor(private appRef: ApplicationRef, private ngZone: NgZone) {}

  /**
   *
   * @param {Partial<PopperOptions>} options
   */
  create(origin: HTMLElement, tplPortal: DatoTemplatePortal) {
    this.created = true;
    this.origin = origin;
    this.tplPortal = tplPortal;
  }

  /**
   *
   * @param {Partial<PopperOptions>} options
   */
  attach(options: Partial<PopperOptions>, classes: string) {
    this.appRef.attachView(this.tplPortal.viewRef);
    this.createPopper(this.createOverlay(classes), options);
    this.attached = true;
    this.onClickSubscription = fromEvent(document.body, 'click', { capture: true }).subscribe(this.handleClick.bind(this));
  }

  /**
   * Reposition the overlay
   */
  scheduleUpdate() {
    this.popper.scheduleUpdate();
  }

  /**
   *
   * @returns {Observable<any>}
   */
  get backDropClick$() {
    return this.backDropClick.asObservable();
  }

  /**
   *
   * @param {MouseEvent} event
   */
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
  private createOverlay(classes: string) {
    this.overlay = createElement('div');
    addClass(this.overlay, `dato-overlay`);
    addClass(this.overlay, classes);
    appendChild(this.overlay, this.tplPortal.elementRef);
    appendToBody(this.overlay);
    return this.overlay;
  }

  /**
   *
   * @param {HTMLElement} target
   * @param {Partial<PopperOptions>} options
   */
  private createPopper(target: HTMLElement, options: Partial<PopperOptions>) {
    this.ngZone.runOutsideAngular(() => {
      this.popper = new Popper(this.origin, target, options);
      this.popper.scheduleUpdate();
    });
  }

  /**
   * Call this method when you close the dropdown
   */
  detach() {
    this.popper.options.removeOnDestroy = true;
    this.popper.destroy();
    this.attached = false;
  }

  /**
   * Call this method on `ngOnDestroy` of the component
   */
  destroy() {
    if (this.attached) {
      this.popper.options.removeOnDestroy = true;
    }
    this.popper.destroy();
    this.appRef.detachView(this.tplPortal.viewRef);
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
