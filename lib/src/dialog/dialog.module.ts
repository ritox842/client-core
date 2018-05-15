import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoDialogComponent } from './dialog/dialog.component';
import { DatoDialogRef } from './dialog-ref';
import { DatoDialogHeaderComponent } from './header/header.component';
import { DialogContentComponent } from './content/dialog-content.component';
import { DatoDialogFooterComponent } from './footer/dialog-footer.component';
import { DialogCloseDirective } from './dialog-close.directive';
import { DatoIconButtonModule } from '../icon-button/icon-button.module';

@NgModule({
  imports: [CommonModule, DatoIconButtonModule],
  providers: [DatoDialogRef],
  declarations: [DatoDialogComponent, DatoDialogHeaderComponent, DialogContentComponent, DatoDialogFooterComponent, DialogCloseDirective],
  exports: [DatoDialogComponent, DatoDialogHeaderComponent, DialogContentComponent, DatoDialogFooterComponent, DialogCloseDirective],
  entryComponents: [DatoDialogComponent]
})
export class DatoDialogModule {}
