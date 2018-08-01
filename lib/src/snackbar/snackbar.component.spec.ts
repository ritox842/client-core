import { Component } from '@angular/core';
import { DatoSnackbar } from './snackbar.service';
import { createTestComponentFactory, query } from '@netbasal/spectator';
import { DatoSnackbarComponent } from './snackbar.component';
import { DatoTranslateService, stubs } from '../services/public_api';
import { DatoIconModule } from '../icon/icon.module';
import { IconRegistry } from '../services/icon-registry';

@Component({ selector: 'custom-host', template: '' })
class TestComponent {
  constructor(public snackbar: DatoSnackbar) {}
}

describe('DatoSnackbar', () => {
  let spectator;

  beforeEach(() => {
    const snack = document.querySelector('dato-snackbar');
    if (snack) {
      document.body.removeChild(snack);
    }
  });

  const createComponent = createTestComponentFactory({
    component: TestComponent,
    declarations: [DatoSnackbarComponent],
    imports: [DatoIconModule],
    providers: [DatoSnackbar, DatoTranslateService, stubs.translate(), IconRegistry],
    entryComponents: [DatoSnackbarComponent]
  });

  it('should show a info snack', () => {
    spectator = createComponent();
    spectator.component.snackbar.info('Info');
    expect(query('.dato-snack-content')).toHaveText('Info');
    expect(query('dato-snackbar')).toHaveClass('dato-snackbar-info');
    expect('dato-snackbar').toExist();
    expect('.dato-snackbar-circle').not.toExist();
  });

  it('should show a success snack', () => {
    spectator = createComponent();
    spectator.component.snackbar.success('Success');
    expect(query('.dato-snack-content')).toHaveText('Success');
    expect(query('dato-snackbar')).toHaveClass('dato-snackbar-success');
    expect(query('dato-snackbar')).toExist();
    expect(query('.dato-icon-checkmark')).toExist();
    expect(query('.dato-snackbar-circle')).toExist();
  });

  it('should show an error snack', () => {
    spectator = createComponent();
    spectator.component.snackbar.error('Error');
    expect(query('.dato-snack-content')).toHaveText('Error');
    expect(query('dato-snackbar')).toHaveClass('dato-snackbar-error');
    expect(query('dato-snackbar')).toExist();
    expect(query('.dato-icon-alert')).toExist();
    expect(query('.dato-snackbar-circle')).toExist();
  });

  it('should show a dramatic success snack', () => {
    spectator = createComponent();
    spectator.component.snackbar.dramaticSuccess('Dramatic Success');
    expect(query('.dato-snack-content')).toHaveText('Dramatic Success');
    expect(query('dato-snackbar')).toHaveClass('dato-snackbar-dramatic-success');
    expect(query('dato-snackbar')).toExist();
    expect(query('.dato-icon-checkmark')).toExist();
    expect(query('.dato-snackbar-circle')).toExist();
  });

  it('should show a dramatic error snack', () => {
    spectator = createComponent();
    spectator.component.snackbar.dramaticError('Dramatic Error');
    expect(query('.dato-snack-content')).toHaveText('Dramatic Error');
    expect(query('dato-snackbar')).toHaveClass('dato-snackbar-dramatic-error');
    expect(query('dato-snackbar')).toExist();
    expect(query('.dato-icon-alert')).toExist();
    expect(query('.dato-snackbar-circle')).toExist();
  });

  describe('Dismissable', () => {
    it('should show the x icon', () => {
      spectator = createComponent();
      spectator.component.snackbar.info('Info', { dismissible: true });
      expect(query('.dato-snack-content')).toHaveText('Info');
      expect(query('dato-snackbar')).toHaveClass('dato-snackbar-info');
      expect(query('dato-snackbar')).toExist();
      expect(query('.dato-snackbar-circle')).not.toExist();
      expect(query('.dato-icon-alert')).toExist();
    });

    it('should close when animation done', () => {
      spectator = createComponent();
      spectator.component.snackbar.info('Info', { dismissible: true });
      query('dato-snackbar').style.animation = 'none';
      query('dato-snackbar').dispatchEvent(new AnimationEvent('animationend', { animationName: 'snackbarOut' }));
      console.log(query('dato-snackbar'));
      expect(query('dato-snackbar')).not.toExist();
    });

    it('should emit after dismiss', () => {
      spectator = createComponent();
      const spy = jasmine.createSpy();
      spectator.component.snackbar.info('Info', { dismissible: true }).afterDismissed.subscribe(spy);
      query('dato-snackbar').style.animation = 'none';
      query('dato-snackbar').dispatchEvent(new AnimationEvent('animationend', { animationName: 'snackbarOut' }));
      expect(query('dato-snackbar')).not.toExist();
      expect(spy).toHaveBeenCalledWith({ closedByAction: false });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit after dismiss - action', () => {
      spectator = createComponent();
      const spy = jasmine.createSpy();
      spectator.component.snackbar.info('Info', { dismissible: true }).afterDismissed.subscribe(spy);
      query('.dato-icon-alert').click();
      query('dato-snackbar').style.animation = 'none';
      query('dato-snackbar').dispatchEvent(new AnimationEvent('animationend', { animationName: 'snackbarOut' }));
      expect(query('dato-snackbar')).not.toExist();
      expect(spy).toHaveBeenCalledWith({ closedByAction: true });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
