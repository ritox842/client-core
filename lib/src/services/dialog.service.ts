import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, TemplateRef, ViewContainerRef } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { DatoDialogComponent } from '../dialog/dialog/dialog.component';
import { DatoDialogRef } from '../dialog/dialog-ref';
import { ContentType, DatoDialogOptions, getDefaultOptions } from '../dialog/dialog.options';
import { createGUID, toBoolean } from '@datorama/utils';
import { DialogConfig } from '../dialog/dialog.config';

@Injectable()
export class DatoDialog {
  private dialogs = new Map<string, DialogConfig>();
  private dialogsStack: DialogConfig[] = [];

  private lastZIndex = 10000;

  constructor(private resolver: ComponentFactoryResolver, private applicationRef: ApplicationRef, private injector: Injector) {}

  /**
   *
   * @param {ContentType} content
   * @param {Partial<DatoDialogOptions>} options
   * @returns {Observable<any>}
   */
  open<T>(content: ContentType, options: Partial<DatoDialogOptions> = {}) {
    const mergedOptions = { ...getDefaultOptions(), ...options };
    const dialogRef = this.createDialogRef(mergedOptions);

    const config = new DialogConfig(dialogRef);

    if (this.dialogs.has(mergedOptions.id)) {
      throw new Error(`A dialog with the key '${mergedOptions.id}' already exist.`);
    }

    dialogRef._onDestroy(this.onDestroy.bind(this, config));
    this.createModalComponent(content, config);
    this.injectToDOM(mergedOptions.container, config);
    this.registerEvents(config);

    this.dialogs.set(mergedOptions.id, config);
    this.dialogsStack.push(config);

    return dialogRef;
  }

  close(result?: any) {
    const config = this.getLastOpenedDialog();
    config && config.dialogRef.close(result);
  }

  dismiss(reason?: any) {
    const config = this.getLastOpenedDialog();
    config && config.dialogRef.dismiss(reason);
  }

  private getLastOpenedDialog() {
    if (this.dialogsStack.length) {
      return this.dialogsStack[this.dialogsStack.length - 1];
    }
    return null;
  }

  /**
   *
   * @param {DatoDialogOptions} options
   */
  private createDialogRef(options: DatoDialogOptions): DatoDialogRef {
    if (!toBoolean(options.id)) {
      options.id = createGUID();
    }
    const dialogRef = new DatoDialogRef();
    dialogRef.options = options;
    dialogRef._setData(options.data);

    return dialogRef;
  }

  /**
   *
   * @param {ContentType} content
   * @param {DatoDialogOptions} options
   */
  private createModalComponent(content: ContentType, config: DialogConfig) {
    /** Todo: Move to Angular Utils file - createDynamicComponent(component, injector, contentRef): ComponentRef */
    const factory = this.resolver.resolveComponentFactory(DatoDialogComponent);
    const dialogRef = config.dialogRef;
    const ngContent = this.generateNgContent(config, content, this.resolver, this.createInjector(dialogRef.options.viewContainerRef, dialogRef), dialogRef);

    const componentRef = factory.create(this.injector, ngContent);
    componentRef.instance.options = dialogRef.options;
    componentRef.changeDetectorRef.detectChanges();

    config.componentRef = componentRef;
  }

  /**
   *
   * @param container
   */
  private injectToDOM(container: Element, config: DialogConfig) {
    const element = config.componentRef.location.nativeElement;
    const dialogElement = container.appendChild(element);
    config.dialogElement = dialogElement;
    config.viewRef.detectChanges();
  }

  /**
   *
   * @param {ViewContainerRef} viewContainerRef
   * @returns {Injector}
   */
  private createInjector(viewContainerRef: ViewContainerRef, dialogRef: DatoDialogRef) {
    return Injector.create({
      parent: viewContainerRef ? viewContainerRef.injector : this.injector,
      providers: [
        {
          provide: DatoDialogRef,
          useValue: dialogRef
        }
      ]
    });
  }

  /**
   *
   * @param {Element} element
   */
  private registerEvents(config: DialogConfig) {
    const dialogElement = config.dialogElement.querySelector('.dato-dialog') as HTMLElement;

    // set next z-index
    dialogElement.style.zIndex = (++this.lastZIndex).toString();

    // listen for close events
    if (config.dialogRef.options.enableClose === false) {
      return;
    }

    const modalClick$ = fromEvent(dialogElement, 'click');
    const escapeClick$ = fromEvent(document, 'keyup').pipe(filter((e: KeyboardEvent) => e.keyCode === 27));

    merge(modalClick$, escapeClick$)
      .pipe(takeUntil(config.dialogRef.$destroyed))
      .subscribe(() => {
        config.dialogRef.dismiss();
      });
  }

  /**
   * Cleaning to prevent memory leaks
   */
  private onDestroy(config: DialogConfig) {
    config.viewRef && this.applicationRef.detachView(config.viewRef);
    config.innerComponentRef && config.innerComponentRef.destroy();
    config.componentRef && config.componentRef.destroy();

    document.body.removeChild(config.dialogElement);

    const id = config.dialogRef.options.id;
    if (this.dialogs.has(id)) {
      this.dialogs.delete(id);
      // filter-out the item
      this.dialogsStack = this.dialogsStack.filter(d => d !== config);
    }
  }

  /**
   * Todo: Move to Angular Utils file
   * @param {ContentType} content
   * @param {ComponentFactoryResolver} resolver
   * @param {Injector} injector
   * @param {{}} context
   * @returns {any}
   */
  private generateNgContent(config: DialogConfig, content: ContentType, resolver: ComponentFactoryResolver, injector: Injector, context = {}) {
    if (typeof content === 'string') {
      const element = document.createElement('text');
      element.textContent = content;
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      config.viewRef = content.createEmbeddedView(context);
      this.applicationRef.attachView(config.viewRef);
      return [(config.viewRef as EmbeddedViewRef<any>).rootNodes];
    }

    const factory = resolver.resolveComponentFactory(content);
    config.innerComponentRef = factory.create(injector);
    config.viewRef = config.innerComponentRef.hostView;
    this.applicationRef.attachView(config.viewRef);
    return [[config.innerComponentRef.location.nativeElement]];
  }
}
