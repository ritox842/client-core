import {Directive, ElementRef, Input, TemplateRef} from '@angular/core';
import {RowSelectionType, showWhenFunc, ToolbarActionType} from './grid-toolbar';

@Directive({
  selector: '[datoGridToolbarItem]'
})
export class DatoGridToolbarItemDirective {
  @Input() showWhen : RowSelectionType | showWhenFunc;
  @Input() actionType : ToolbarActionType;
  @Input() order : number;

  constructor( public tpl : TemplateRef<any> ) {
  }
}

@Directive({
  selector: '[datoGridToolbarItemElement]'
})
export class DatoGridToolbarItemElementDirective {
  constructor( public element : ElementRef ) {
  }
}
