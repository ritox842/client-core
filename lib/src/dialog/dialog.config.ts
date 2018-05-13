import { ComponentRef } from '@angular/core';
import { DatoDialogRef } from './dialog-ref';
import { DatoDialogComponent } from './modal/dialog.component';
import { ViewRef } from '@angular/core/src/linker/view_ref';

export class DialogConfig {
  private _viewRef: ViewRef;
  private _innerComponentRef: ComponentRef<any>;
  private _componentRef: ComponentRef<DatoDialogComponent>;
  private _dialogElement: HTMLElement;

  constructor(private _dialogRef: DatoDialogRef) {}

  get dialogRef(): DatoDialogRef {
    return this._dialogRef;
  }

  get viewRef(): ViewRef {
    return this._viewRef;
  }
  set viewRef(value: ViewRef) {
    this._viewRef = value;
  }

  get innerComponentRef(): ComponentRef<any> {
    return this._innerComponentRef;
  }
  set innerComponentRef(value: ComponentRef<any>) {
    this._innerComponentRef = value;
  }

  get dialogElement(): HTMLElement {
    return this._dialogElement;
  }
  set dialogElement(value: HTMLElement) {
    this._dialogElement = value;
  }

  get componentRef(): ComponentRef<DatoDialogComponent> {
    return this._componentRef;
  }
  set componentRef(value: ComponentRef<DatoDialogComponent>) {
    this._componentRef = value;
  }
}
