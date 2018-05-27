import { createTestComponentFactory } from '@netbasal/spectator';
import { DatoDialog } from './dialog.service';
import { DatoTranslateService, stubs } from '../services/public_api';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { DatoIconModule } from '../icon/icon.module';
import { IconRegistry } from '../services/icon-registry';
import { DatoDialogComponent } from './dialog/dialog.component';
import { DatoConfirmationDialogComponent } from './confirmation/confirmation-dialog.component';
import { DatoDialogCloseDirective } from './dialog-close.directive';
import { DatoDialogDismissDirective } from './dialog-dismiss.directive';
import { DatoDialogHeaderComponent } from './header/header.component';
import { DatoDialogContentComponent } from './content/dialog-content.component';
import { DatoDialogFooterComponent } from './footer/dialog-footer.component';
import { DatoDirectivesModule } from '../directives/directives.module';
import { DatoDynamicContentModule } from '../dynamic-content/dynamic-content.module';
import { DatoIconButtonModule } from '../icon-button/icon-button.module';
import { DatoButtonModule } from '../button/button.module';

@Component({
  selector: 'custom-host',
  template: `<ng-template #tpl>hello from template</ng-template>`
})
class TestComponent {
  @ViewChild('tpl') dialogTpl: TemplateRef<any>;
  constructor(public dialog: DatoDialog) {}
}

@Component({ selector: 'dialog-content', template: '' })
class DialogContentComponent {
  constructor() {}
}

describe('DatoDialog', () => {
  const createComponent = createTestComponentFactory({
    component: TestComponent,
    declarations: [DatoDialogComponent, DatoDialogHeaderComponent, DatoDialogContentComponent, DatoDialogFooterComponent, DatoDialogCloseDirective, DatoDialogDismissDirective, DatoConfirmationDialogComponent, DialogContentComponent],
    imports: [DatoIconModule, DatoDynamicContentModule, DatoDirectivesModule, DatoIconButtonModule, DatoButtonModule],
    providers: [DatoDialog, DatoTranslateService, stubs.translate(), IconRegistry],
    entryComponents: [DatoDialogComponent, DatoConfirmationDialogComponent, DialogContentComponent]
  });

  let spectator, component, dialog: DatoDialog;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    dialog = component.dialog;
  });

  afterEach(() => {
    dialog.closeAll();
  });

  it('should display the dialog with a text content', () => {
    dialog.open('hello');
    expect('.dato-dialog-projection').toHaveText('hello');
  });

  it('should display the dialog with a custom component', () => {
    dialog.open(DialogContentComponent);
    expect('dialog-content').toExist();
  });

  it('should display the dialog with a template', () => {
    dialog.open(component.dialogTpl);
    expect('.dato-dialog-projection').toHaveText('hello from template');
  });

  it('should display a confirmation dialog', () => {
    dialog.confirm();
    expect('dato-confirmation-dialog').toExist();
  });

  it('should have a backdrop', () => {
    dialog.open(DialogContentComponent);
    expect('.dato-dialog').toHaveClass('backdrop');
  });

  it('should NOT have a backdrop', () => {
    dialog.open(DialogContentComponent, {
      backdrop: false
    });
    expect('.dato-dialog').not.toHaveClass('backdrop');
  });
});
