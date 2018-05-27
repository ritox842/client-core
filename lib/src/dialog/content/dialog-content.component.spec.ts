import { DatoDialogContentComponent } from './dialog-content.component';
import { DatoTranslateService, stubs } from '../../services/public_api';
import { createHostComponentFactory, query, SpectatorWithHost } from '@netbasal/spectator';

describe('DialogContentComponent', () => {
  let host: SpectatorWithHost<DatoDialogContentComponent>;

  const createHost = createHostComponentFactory({
    component: DatoDialogContentComponent,
    imports: [],
    providers: [DatoTranslateService, stubs.translate()],
    entryComponents: []
  });

  it('should display the title', () => {
    host = createHost(`<dato-dialog-content>Content</dato-dialog-content>`);
    expect(query('dato-dialog-content')).toHaveText('Content');
  });
});
