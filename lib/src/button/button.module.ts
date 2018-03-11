import { NgModule } from '@angular/core';
import { DatoButtonComponent } from './button.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [DatoButtonComponent],
  exports: [DatoButtonComponent]
})
export class DatoButtonModule {}
