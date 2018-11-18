import { DatoMultiOptionComponent } from './multi-option.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoOptionComponent } from './option.component';
import { DatoInputModule } from '../input/input.module';
import { DatoGroupComponent } from './group.component';
import { DatoLinkButtonModule } from '../link-button/link-button.module';
import { DatoTextModule } from '../text/text.module';
import { DatoButtonModule } from '../button/button.module';
import { DatoIconModule } from '../icon/icon.module';
import { NgModule } from '@angular/core';
import { DatoCheckboxModule } from '../checkbox/checkbox.module';
import { CommonModule } from '@angular/common';
import { DatoDirectivesModule } from '../../src/directives/directives.module';

const publicApi = [DatoOptionComponent, DatoGroupComponent, DatoMultiOptionComponent];

@NgModule({
  imports: [CommonModule, DatoInputModule, DatoIconModule, ReactiveFormsModule, DatoCheckboxModule, DatoButtonModule, DatoLinkButtonModule, DatoTextModule, DatoDirectivesModule],
  declarations: [publicApi],
  exports: [publicApi],
  entryComponents: [publicApi]
})
export class DatoOptionsModule {}
