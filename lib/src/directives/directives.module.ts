import { NgModule } from '@angular/core';
import { DatoOriginDirective } from './origin.directive';

const directives = [DatoOriginDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DatoDirectives {}
