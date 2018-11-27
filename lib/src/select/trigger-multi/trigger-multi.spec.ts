import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoDirectivesModule, DatoIconModule, DatoInputModule, DatoTranslateService, DatoTriggerMulti, IconRegistry } from '../../../public_api';
import { TranslatePipe } from '../../../../playground/src/app/translate.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

function generateOptions() {
  const arr = [];
  for (var i = 0, len = 15; i < len; i++) {
    arr.push({
      label: `Item ${i + 1}`,
      id: i + 1
    });
  }
  return arr;
}

describe('DatoTriggerMulti', () => {
  let host: SpectatorWithHost<DatoTriggerMulti>;
  const componentTag = `<dato-trigger-multi></dato-trigger-multi>`;
  const createHost = createHostComponentFactory({
    component: DatoTriggerMulti,
    providers: [DatoTranslateService, TranslatePipe, IconRegistry],
    imports: [DatoIconModule, DatoInputModule, DatoDirectivesModule, ReactiveFormsModule]
  });

  describe('With disabledIDs', () => {
    const options = generateOptions();
    const disableOptionsIncrementor = 3;
    const disabledIDs = [];

    for (let i = 0; i < options.length; i += disableOptionsIncrementor) {
      disabledIDs.push(options[i].id);
    }

    const componentInput = {
      control: new FormControl(),
      options: options,
      limitTo: options.length,
      disabledIDs
    };

    it('should be defined', () => {
      host = createHost(componentTag, false, componentInput);
      host.detectChanges();
      expect(host.component).toBeDefined();
    });

    it('should hide remove icon for disabled options', () => {
      host = createHost(componentTag, false, componentInput);
      host.detectChanges();
      const elements = host.queryAll('.dato-trigger-multi__active');

      for (let i = 0; i < elements.length; i++) {
        const currentElement = elements[i];
        const currentOption = host.component.options[i];
        if (host.component.isDisabled(currentOption)) {
          const closeIconElement = currentElement.getElementsByTagName('dato-icon')[0];
          expect(closeIconElement.style.visibility).toEqual('hidden');
        }
      }
    });

    it('should show remove icon for disabled options', () => {
      host = createHost(componentTag, false, componentInput);
      host.detectChanges();
      const elements = host.queryAll('.dato-trigger-multi__active');

      for (let i = 0; i < elements.length; i++) {
        const currentElement = elements[i];
        const currentOption = host.component.options[i];
        if (!host.component.isDisabled(currentOption)) {
          const closeIconElement = currentElement.getElementsByTagName('dato-icon')[0];
          expect(closeIconElement.style.visibility).not.toEqual('hidden');
        }
      }
    });

    it('should show as many as limitTo allows and + with leftover', () => {
      host = createHost(componentTag, false, {
        ...componentInput,
        limitTo: 5
      });
      host.detectChanges();
      const elements = host.queryAll('.dato-trigger-multi__active');
      expect(elements.length).toEqual(host.component.limitTo + 1);
    });

    it('should show + _restCount with correct amount', () => {
      host = createHost(componentTag, false, {
        ...componentInput,
        limitTo: 5
      });
      host.detectChanges();
      const element = host.query('.dato-trigger-multi__rest');

      expect(element.textContent.trim()).toEqual(`+${host.component.options.length - host.component.limitTo}`);
    });

    it('should not show + _restCount', () => {
      host = createHost(componentTag, false, componentInput);
      host.detectChanges();
      const element = host.query('.dato-trigger-multi__rest');

      expect(element).not.toExist();
    });
  });
});
