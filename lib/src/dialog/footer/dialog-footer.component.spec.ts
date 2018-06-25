import { DatoDialogFooterComponent } from './dialog-footer.component';
import { createHostComponentFactory, SpectatorWithHost, query } from '@netbasal/spectator';
import { DatoTranslateService, stubs } from '../../services/public_api';

describe('DialogFooterComponent', () => {
  let host: SpectatorWithHost<DatoDialogFooterComponent>;

  const createHost = createHostComponentFactory({
    component: DatoDialogFooterComponent,
    imports: [],
    providers: [DatoTranslateService, stubs.translate()],
    entryComponents: []
  });

  it('should display the title', () => {
    host = createHost(`<dato-dialog-footer>Footer</dato-dialog-footer>`);
    expect(query('dato-dialog-footer')).toHaveText('Footer');
  });
});
