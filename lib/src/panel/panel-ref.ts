import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export class PanelRef {
  private _afterDismissed = new EventEmitter();

  get afterDismissed() {
    return this._afterDismissed.asObservable();
  }

  _notify() {
    this._afterDismissed.next();
    this._afterDismissed.complete();
  }
}
