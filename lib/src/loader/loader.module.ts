import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoLoaderComponent } from './loader.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DatoLoaderComponent],
  exports: [DatoLoaderComponent]
})
export class DatoLoaderModule {}
