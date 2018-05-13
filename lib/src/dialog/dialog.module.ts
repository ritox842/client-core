import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoDialogComponent } from './modal/dialog.component';
import { DatoDialogRef } from './dialog-ref';
import { DatoDialogHeaderComponent } from './header/header.component';
import { DialogContentComponent } from './content/dialog-content.component';
import { DatoDialogFooterComponent } from './footer/dialog-footer.component';
import { DialogCloseButtonDirective } from './dialog-close-btn.directive';

@NgModule({
  imports: [CommonModule],
  providers: [DatoDialogRef],
  declarations: [DatoDialogComponent, DatoDialogHeaderComponent, DialogContentComponent, DatoDialogFooterComponent, DialogCloseButtonDirective],
  exports: [DatoDialogHeaderComponent, DialogContentComponent, DatoDialogFooterComponent, DialogCloseButtonDirective],
  entryComponents: [DatoDialogComponent]
})
export class DatoDialogModule {}
