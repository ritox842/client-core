import { DatoTextModule } from './../text/text.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoRadioComponent } from './radio.component';

const declerations = [DatoRadioComponent];

@NgModule({
  imports: [CommonModule, DatoTextModule],
  declarations: [declerations],
  exports: [declerations]
})
export class DatoRadioModule {}
