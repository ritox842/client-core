import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatoDialogOptions } from './dialog.options';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

export class DatoDialogRef {
  /** Listeners **/
  private _beforeClose = new ReplaySubject();
  private _afterClose = new Subject();
  private _destroy: () => void;

  private _destroySubject = new Subject();

  private _data;

  private _dialogOptions: DatoDialogOptions;

  get $destroyed() {
    return this._destroySubject.asObservable();
  }

  get data() {
    return this._data;
  }

  set options(options: DatoDialogOptions) {
    this._dialogOptions = options;
  }
  get options(): DatoDialogOptions {
    return this._dialogOptions;
  }

  constructor() {}

  /**
   * Closing the modal dialog, passing an optional result.
   */
  close(result?: any): void {
    this._beforeClose.next(result);
    this._beforeClose.complete();

    this.destroy();

    this._afterClose.next(result);
    this._afterClose.complete();
  }

  /**
   * Dismiss the modal dialog, passing an optional reason.
   */
  dismiss(reason?: any): void {
    this._beforeClose.error(reason);

    this.destroy();

    this._afterClose.error(reason);
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  beforeClose(): Observable<{}> {
    return this._beforeClose.asObservable().pipe(take(1));
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClose(): Observable<{}> {
    return this._afterClose.asObservable().pipe(take(1));
  }

  private destroy() {
    this._destroy();
    this._destroySubject.next();
    this._destroySubject.complete();
  }

  _setData(data) {
    this._data = data;
  }

  _onDestroy(destroyFn: () => void) {
    this._destroy = destroyFn;
  }
}
