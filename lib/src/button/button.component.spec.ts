import { DatoButtonComponent } from './button.component';
import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';

describe('DatoButtonComponent', () => {
  let host: SpectatorWithHost<DatoButtonComponent>;

  const createHost = createHostComponentFactory(DatoButtonComponent);

  it('should create', () => {
    host = createHost(`<dato-button>Click</dato-button>`);

    expect(host.component).toBeDefined();
  });

  it('should render the text', () => {
    host = createHost(`<dato-button>Click</dato-button>`);

    expect(host.query('button')).toHaveText('Click');
  });
});
