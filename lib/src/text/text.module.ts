import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoTextComponent } from './text.component';
import { DatoFontDirective } from './font.directive';

export const declarations = [DatoTextComponent, DatoFontDirective];

@NgModule({
  imports: [CommonModule],
  declarations: [...declarations],
  exports: [...declarations]
})
export class DatoTextModule {}
