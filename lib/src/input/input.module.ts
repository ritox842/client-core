import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { DatoThemesModule } from '../themes/themes.module';
import { DatoIconModule } from '../icon/icon.module';

@NgModule({
  imports: [CommonModule, DatoIconModule, DatoThemesModule],
  declarations: [InputComponent],
  exports: [InputComponent]
})
export class DatoInputModule {}
