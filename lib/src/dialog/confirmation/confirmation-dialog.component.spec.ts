import { createHostComponentFactory, query, queryAll, SpectatorWithHost } from '@netbasal/spectator';
import { DatoTranslateService, stubs } from '../../services/public_api';
import { DatoConfirmationDialogComponent } from './confirmation-dialog.component';
import { DatoDialogRef } from '../dialog-ref';
import { IconRegistry } from '../../services/icon-registry';
import { DatoDirectivesModule } from '../../directives/directives.module';
import { DatoDialog } from '../dialog.service';
import { DatoIconButtonModule } from '../../icon-button/icon-button.module';
import { ConfirmationType, DatoActionType, DatoConfirmationOptions, getDefaultConfirmationOptions } from '../config/dialog-confirmation.options';
import { DatoButtonModule, DatoIconModule } from '../../../';
import { DatoDynamicContentModule } from '../../dynamic-content/dynamic-content.module';
import { DatoDialogCloseDirective } from '../dialog-close.directive';
import { DatoDialogDismissDirective } from '../dialog-dismiss.directive';
import { DatoDialogHeaderComponent } from '../header/header.component';
import { DatoDialogContentComponent } from '../content/dialog-content.component';
import { DatoDialogFooterComponent } from '../footer/dialog-footer.component';

function createHostComponent(dialogRefOptions: Partial<DatoConfirmationOptions> = {}) {
  const dialogRefStub = {
    options: { ...getDefaultConfirmationOptions(), ...dialogRefOptions }
  };

  return createHostComponentFactory({
    component: DatoConfirmationDialogComponent,
    declarations: [DatoDialogHeaderComponent, DatoDialogContentComponent, DatoDialogFooterComponent, DatoDialogCloseDirective, DatoDialogDismissDirective],
    imports: [DatoDirectivesModule, DatoIconButtonModule, DatoIconModule, DatoDynamicContentModule, DatoButtonModule],
    providers: [DatoTranslateService, stubs.translate(), DatoDialog, { provide: DatoDialogRef, useValue: dialogRefStub }, IconRegistry],
    entryComponents: []
  });
}

describe('ConfirmationDialogComponent', () => {
  const disruptiveClass = 'disruptive';

  describe('default settings with text content', () => {
    let host: SpectatorWithHost<DatoConfirmationDialogComponent>;

    const expectedContent = 'DIALOG_CONTENT';
    const createHost = createHostComponent({ content: expectedContent });

    it('should display the text content', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      expect('dato-dialog-content').toHaveText(expectedContent);
    });

    it('should not be disruptive warning', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      expect('dato-confirmation-dialog').not.toHaveClass(disruptiveClass);
    });

    it('should have the default buttons', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      expect(queryAll('dato-confirmation-dialog dato-button[datoType="primary"]').length).toEqual(1);
      expect(queryAll('dato-confirmation-dialog dato-button[datoType="secondary"]').length).toEqual(1);
    });
  });

  describe('disruptive warning with one button', () => {
    let host: SpectatorWithHost<DatoConfirmationDialogComponent>;

    const createHost = createHostComponent({
      confirmationType: ConfirmationType.DISRUPTIVE_WARNING,
      actions: [
        {
          type: DatoActionType.SUCCESS,
          caption: 'OK'
        }
      ]
    });

    it('should have a disruptive css class', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      expect('dato-confirmation-dialog').toHaveClass(disruptiveClass);
    });

    it('should have one primary button with OK text', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      const primaryBtn = query('dato-confirmation-dialog dato-button[datoType="primary"]');
      expect(primaryBtn).toExist();
      expect(primaryBtn).toHaveText('OK');
    });
  });

  describe('disruptive warning', () => {
    let host: SpectatorWithHost<DatoConfirmationDialogComponent>;

    const createHost = createHostComponent({ confirmationType: ConfirmationType.DISRUPTIVE_WARNING });

    it('should display a disruptive warning', () => {
      host = createHost(`<dato-confirmation-dialog></dato-confirmation-dialog>`);
      expect('dato-confirmation-dialog').toHaveClass(disruptiveClass);
    });
  });
});
