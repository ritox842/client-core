import { AceComponent } from './ace.component';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { TranslateMock } from '@datorama/tests/utils';

describe('AceComponent', () => {
  let host: SpectatorWithHost<AceComponent>;
  const createHost = createHostComponentFactory({
    component: AceComponent,
    declarations: [TranslateMock]
  });

  it('should be defined', () => {
    host = createHost(`<dato-ace></dato-ace>`);
    expect(host.component).toBeDefined();
  });
});
