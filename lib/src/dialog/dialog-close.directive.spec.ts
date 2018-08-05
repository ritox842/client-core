import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoDialogCloseDirective } from './dialog-close.directive';
import { DatoDialogRef } from './dialog-ref';
import { DatoButtonModule } from '../../';

describe('DialogCloseDirective', () => {
  let host: SpectatorWithHost<DatoDialogCloseDirective>;

  const createHost = createHostComponentFactory({
    component: DatoDialogCloseDirective,
    mocks: [DatoDialogRef],
    imports: [DatoButtonModule]
  });

  it('should call the close function', () => {
    host = createHost(`<dato-button datoDialogClose>ok</dato-button>`);
    const ref = host.get(DatoDialogRef);
    host.click(host.element);
    expect(ref.close).toHaveBeenCalled();
  });

  it('should call the close function with result', () => {
    host = createHost(`<dato-button datoDialogClose="custom_result">ok</dato-button>`);
    const ref = host.get(DatoDialogRef);
    host.click(host.element);
    expect(ref.close).toHaveBeenCalledWith('custom_result');
  });
});
