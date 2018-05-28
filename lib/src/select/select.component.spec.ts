import { SelectComponent } from './select.component';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { TranslateMock } from '@datorama/tests/utils';

describe('SelectComponent', () => {
  let host: SpectatorWithHost<SelectComponent>;
  const createHost = createHostComponentFactory({
    component: SelectComponent,
    declarations: [TranslateMock]
  });

  it('should be defined', () => {
    host = createHost(`<dato-select></dato-select>`);
    expect(host.component).toBeDefined();
  });
});
