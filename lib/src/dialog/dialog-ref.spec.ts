import { createService } from '@netbasal/spectator';
import { DatoDialogRef } from './dialog-ref';
import { DatoDialogResult, DialogResultStatus } from './config/dialog.options';
import { of } from 'rxjs';

describe('DialogRef', () => {
  let spectator = createService<DatoDialogRef>(DatoDialogRef);

  beforeEach(() => {
    spectator.service._onDestroy(() => {});
  });

  it('should close the dialog with a valid result', () => {
    const result = 'my result';
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      expect(dialogResult.status).toEqual(DialogResultStatus.SUCCESS);
      expect(dialogResult.data).toEqual(result);
    });
    spectator.service.close(result);
  });

  it('should dismiss the dialog with a valid result', () => {
    const result = 'Leave me!';
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      expect(dialogResult.status).toEqual(DialogResultStatus.DISMISSED);
      expect(dialogResult.data).toEqual(result);
    });
    spectator.service.dismiss(result);
  });

  it('should not closed the dialog when beforeClosed event return false', () => {
    const result = 'custom message';
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      fail('The dialog should not be closed.');
    });
    spectator.service.beforeClosed(beforeClosedResult => {
      expect(beforeClosedResult.status).toEqual(DialogResultStatus.SUCCESS);
      expect(beforeClosedResult.data).toEqual(result);

      return false;
    });
    spectator.service.close(result);
  });

  it('should not dismissed the dialog when beforeClosed event return false', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });
    spectator.service.beforeClosed(beforeClosedResult => {
      expect(beforeClosedResult.status).toEqual(DialogResultStatus.DISMISSED);
      expect(beforeClosedResult.data).toEqual(result);

      return false;
    });
    spectator.service.dismiss(result);

    expect(dialogClosed).toEqual(false);
  });

  it('should not closed the dialog when beforeClosed event return observable of false', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });
    spectator.service.beforeClosed(() => {
      return of(false);
    });
    spectator.service.close(result);
    spectator.service.dismiss(result);

    expect(dialogClosed).toEqual(false);
  });

  it('should closed the dialog when beforeClosed event return observable of true', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });
    spectator.service.beforeClosed(() => {
      return of(true);
    });
    spectator.service.close(result);

    expect(dialogClosed).toEqual(true);
  });

  it('should closed the dialog when beforeClosed event return true', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });
    spectator.service.beforeClosed(() => {
      return true;
    });
    spectator.service.close(result);

    expect(dialogClosed).toEqual(true);
  });

  it('should not closed the dialog when one of beforeClosed events return false', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });

    let callCounter = 0;
    spectator.service.beforeClosed(() => {
      callCounter++;
      return true;
    });
    spectator.service.beforeClosed(() => {
      callCounter++;
      return false;
    });
    spectator.service.beforeClosed(() => {
      callCounter++;
      return of(true);
    });
    spectator.service.close(result);

    expect(callCounter).toEqual(3);
    expect(dialogClosed).toEqual(false);
  });

  it('should closed the dialog when all beforeClosed events return true', () => {
    const result = 'custom message';
    let dialogClosed = false;
    spectator.service.afterClosed().subscribe((dialogResult: DatoDialogResult) => {
      dialogClosed = true;
    });

    let callCounter = 0;
    spectator.service.beforeClosed(() => {
      callCounter++;
      return true;
    });
    spectator.service.beforeClosed(() => {
      callCounter++;
      return true;
    });
    spectator.service.beforeClosed(() => {
      callCounter++;
      return of(true);
    });
    spectator.service.close(result);

    expect(callCounter).toEqual(3);
    expect(dialogClosed).toEqual(true);
  });
});
