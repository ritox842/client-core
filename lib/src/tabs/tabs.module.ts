import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatoTabset, DatoTab, DatoTabContent, DatoTabTitle, DatoTabChangeEvent } from './tabs.component';

const publicApi = [DatoTabset, DatoTab, DatoTabContent, DatoTabTitle];

@NgModule({
  declarations: publicApi,
  exports: publicApi,
  imports: [CommonModule]
})
export class DatoTabsModule {}
