import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoSortableComponent } from './sortable.component';
import { SortablejsModule } from 'angular-sortablejs';
import { DatoSortableHandleDirective } from './sortable-handle.directive';

const declerations = [DatoSortableComponent, DatoSortableHandleDirective];

@NgModule({
  imports: [CommonModule, SortablejsModule],
  declarations: [declerations],
  exports: [declerations]
})
export class DatoSortableModule {}
