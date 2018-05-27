import { DatoTranslateService, stubs } from '../../services/public_api';
import { DatoDialogHeaderComponent } from './header.component';
import { DatoDirectivesModule } from '../../directives/directives.module';
import { DatoDialogRef } from '../dialog-ref';
import { DatoDialog } from '../dialog.service';
import { DatoIconButtonModule } from '../../icon-button/icon-button.module';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoDialogOptions, getDefaultOptions } from '../config/dialog.options';
import { IconRegistry } from '../../services/icon-registry';

function createHostComponent(dialogRefOptions: Partial<DatoDialogOptions> = {}) {
  const dialogRefStub = {
    options: { ...getDefaultOptions(), ...dialogRefOptions }
  };

  return createHostComponentFactory({
    component: DatoDialogHeaderComponent,
    imports: [DatoDirectivesModule, DatoIconButtonModule],
    providers: [DatoTranslateService, stubs.translate(), DatoDialog, { provide: DatoDialogRef, useValue: dialogRefStub }, IconRegistry],
    entryComponents: []
  });
}

describe('DialogHeaderComponent', () => {
  let host: SpectatorWithHost<DatoDialogHeaderComponent>;

  const createHost = createHostComponent();

  it('should display the header', () => {
    host = createHost(`<dato-dialog-header input="">Header</dato-dialog-header>`);
    expect(host.query('.sub-headline')).toHaveText('Header');
    expect('.x-button').toExist();
  });

  describe('dialogRef', () => {
    let host: SpectatorWithHost<DatoDialogHeaderComponent>;

    const createHost = createHostComponent({ enableClose: false });

    it('should not display the x button', () => {
      host = createHost(`<dato-dialog-header input=""></dato-dialog-header>`);
      expect('.x-button').not.toExist();
    });
  });
});
