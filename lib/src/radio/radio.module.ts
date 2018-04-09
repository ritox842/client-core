import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoRadioComponent } from './radio.component';

const declerations = [DatoRadioComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [declerations],
  exports: [declerations]
})
export class DatoRadioModule {}
