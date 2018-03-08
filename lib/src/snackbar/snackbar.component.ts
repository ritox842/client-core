// import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
// import {getDefaults, SnackbarOptions} from "./snackbar.types";
// import {Subject} from "rxjs/Subject";
//
// @Component({
//   selector: 'dato-snackbar',
//   templateUrl: './snackbar.component.html',
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class DatoSnackbarComponent implements OnInit {
//   private _options : SnackbarOptions;
//   close : Subject<boolean>;
//
//   @Input() set options( options : Partial<SnackbarOptions> ) {
//     this._options = Object.assign({}, options, getDefaults());
//     if ( this.options.dismissible ) {
//       this.close = new Subject<boolean>();
//     }
//   }
//
//   get options() {
//     return this._options;
//   }
//
//   get dismissible() {
//     return this.options.dismissible;
//   }
//
//   get type() {
//     return this.options.type;
//   }
//
//   get undoFunction() {
//     return this.options.undoFunction;
//   }
//
//   get detailsFunction() {
//     return this.options.detailsFunction;
//   }
//
//   get iconClass() {
//     return this.options.type;
//   }
//
//   onClose() {
//     this.close.next(true);
//     this.close.complete();
//   }
//
//   constructor() {
//   }
//
//   ngOnInit() {
//   }
//
// }