import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSnackbarComponent } from './snackbar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DatoSnackbarComponent],
  exports: [DatoSnackbarComponent]
})
export class DatoSnackbarModule {}
