import { Component } from '@angular/core';
import { createTestComponentFactory, query, queryAll } from '@netbasal/spectator';
import { DatoTranslateService, stubs } from '../services/public_api';
import { DatoIconModule } from '../icon/icon.module';
import { IconRegistry } from '../services/icon-registry';
import { DatoToast } from './toast.service';
import { DatoToastComponent } from './toast.component';
import { DatoDynamicContentModule } from '../dynamic-content/dynamic-content.module';
import { DatoThemesModule } from '../themes/themes.module';
import { ComponentFixture } from '@angular/core/testing';

@Component({ selector: 'custom-host', template: '' })
class TestComponent {
  constructor(public toast: DatoToast) {}
}

describe('DatoSnackbar', () => {
  const createComponent = createTestComponentFactory({
    component: TestComponent,
    declarations: [DatoToastComponent],
    imports: [DatoIconModule, DatoDynamicContentModule, DatoThemesModule],
    providers: [DatoToast, DatoTranslateService, stubs.translate(), IconRegistry],
    entryComponents: [DatoToastComponent]
  });

  describe('Single', () => {
    let spectator;
    let fixture: ComponentFixture<DatoToastComponent>;

    beforeEach(() => {
      const toast = query('dato-toast');
      if (toast) {
        query('.dato-toasts-container').removeChild(toast);
      }
    });

    //it('should show a toast', () => {
    //  spectator = createComponent();
    //  fixture = spectator.fixture;
    //  spectator.component.toast.open('Hello world!!');
    //  expect(query('.dato-toast-content')).toHaveText('Hello world!!');
    //  expect('.dato-icon-close').toExist();
    //  expect('.toast-icon').not.toExist();
    //});

    //it('should show a toast with custom icon', () => {
    //  spectator = createComponent();
    //  fixture = spectator.fixture;
    //  spectator.component.toast.open('Hello world!!', { icon: { name: 'alert' } });
    //  expect(query('.dato-toast-content')).toHaveText('Hello world!!');
    //  expect('.dato-icon-close').toExist();
    //  expect('.toast-icon').toExist();
    //});
  });

  //it('should close on X click', () => {
  //  const spectator = createComponent();
  //
  //  spectator.component.toast.open('Hello world!!');
  //  expect(query('.dato-toast-content')).toHaveText('Hello world!!');
  //  query('dato-toast').style.animation = 'none';
  //  query('dato-toast').dispatchEvent(new AnimationEvent('animationend', { animationName: 'toastOut' }));
  //  query('.dato-icon-close').click();
  //  spectator.detectComponentChanges();
  //  expect(query('dato-toast')).not.toExist();
  //});
});
