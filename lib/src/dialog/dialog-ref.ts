import { DatoDialogOptions, DatoDialogResult, DialogResultStatus } from './config/dialog.options';
import { Subject, of, forkJoin, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { toBoolean } from '@datorama/utils';

export type beforeClosedDelegate = (reason: any) => boolean | Observable<boolean>;

export class DatoDialogRef {
  /**
   * Will be used for disable the closing in the future
   */
  private _beforeClose: beforeClosedDelegate[] = [];
  private _afterClose = new Subject<DatoDialogResult>();
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
   * Closing the dialog, passing an optional result.
   */
  close(result?: any): void {
    this.tryClose({
      status: DialogResultStatus.SUCCESS,
      data: result
    });
  }

  /**
   * Dismiss the dialog, passing an optional reason.
   */
  dismiss(reason?: any): void {
    this.tryClose({
      status: DialogResultStatus.DISMISSED,
      data: reason
    });
  }

  /**
   * Register a handler function to be invoked just before the dialog dismissed.
   * The handler should return a boolean indicate if the dialog can be closed.
   * @param {beforeClosedDelegate} fn
   */
  beforeClosed(fn: beforeClosedDelegate) {
    this._beforeClose.push(fn);
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<any> {
    return this._afterClose.asObservable().pipe(take(1));
  }

  /**
   * Check and close the dialog
   * @param {DatoDialogResult} result
   */
  private tryClose(result: DatoDialogResult) {
    this.canClose(result).subscribe(canClose => {
      if (!canClose) {
        return;
      }

      this.destroy();

      this._afterClose.next(result);
      this._afterClose.complete();
    });
  }

  /**
   * Check if the dialog can be closed
   * @param result
   * @return {Observable<boolean>}
   */
  private canClose(result: any): Observable<boolean> {
    if (!this._beforeClose.length) {
      return of(true);
    }

    const observers$ = [];
    this._beforeClose.forEach(handler => {
      let obs$ = handler(result);
      if (typeof obs$ === 'boolean') {
        obs$ = of(obs$);
      }
      observers$.push(obs$);
    });

    return forkJoin(observers$).pipe(
      map(resultArr => {
        return !resultArr.some(res => !toBoolean(res));
      })
    );
  }

  private destroy() {
    this._beforeClose = [];
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
