import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoActionMenuComponent } from './action-menu.component';
import { DatoActionMenuItemComponent } from './action-menu-item.component';

const components = [DatoActionMenuComponent, DatoActionMenuItemComponent];

@NgModule({
  imports: [CommonModule],
  declarations: components,
  exports: components
})
export class DatoActionMenuModule {}
