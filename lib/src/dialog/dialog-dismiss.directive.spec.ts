import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoDialogRef } from './dialog-ref';
import { DatoButtonModule } from '../../';
import { DatoDialogDismissDirective } from './dialog-dismiss.directive';

describe('DialogDismissDirective', () => {
  let host: SpectatorWithHost<DatoDialogDismissDirective>;

  const createHost = createHostComponentFactory({
    component: DatoDialogDismissDirective,
    mocks: [DatoDialogRef],
    imports: [DatoButtonModule]
  });

  it('should call the dismiss function', () => {
    host = createHost(`<dato-button datoDialogDismiss>cancel</dato-button>`);
    const ref = host.get(DatoDialogRef);
    host.click(host.element);
    expect(ref.dismiss).toHaveBeenCalled();
  });

  it('should call the dismiss function with result', () => {
    host = createHost(`<dato-button datoDialogDismiss="custom_result">ok</dato-button>`);
    const ref = host.get(DatoDialogRef);
    host.click(host.element);
    expect(ref.dismiss).toHaveBeenCalledWith('custom_result');
  });
});
