import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { Component } from '@angular/core';
import { DatoIconComponent } from './icon.component';
import { DatoCoreError, IconRegistry } from '../..';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  title = 'Custom HostComponent';
}

describe('With Custom Host Component', () => {
  let host: SpectatorWithHost<DatoIconComponent, CustomHostComponent>;

  const createHost = createHostComponentFactory({
    component: DatoIconComponent,
    providers: [IconRegistry],
    host: CustomHostComponent
  });

  it('should render svg', () => {
    host = createHost(`<dato-icon datoIcon="arrow-left"></dato-icon>`);
    expect(host.hostElement.querySelector('svg')).toExist();
  });

  it('should add custom class', () => {
    host = createHost(`<dato-icon datoIcon="arrow-left"></dato-icon>`);
    expect(host.hostElement.querySelector('.dato-icon-arrow-left')).toExist();
  });

  it('should set the role attribute', () => {
    host = createHost(`<dato-icon datoIcon="arrow-left"></dato-icon>`);
    expect(host.element).toHaveAttr({ attr: 'role', val: 'img' });
  });

  it('should throw when icon doesnt exists', () => {
    expect(function() {
      host = createHost(`<dato-icon datoIcon="arrow-not-exists"></dato-icon>`);
    }).toThrow(new DatoCoreError(`arrow-not-exists Icon - does not exists, did you misspell it?`));
  });

  it('should change icons ', () => {
    host = createHost(`<dato-icon datoIcon="arrow-left"></dato-icon>`);
    spyOn(host.component as any, 'injectSvg').and.callThrough();
    host.setInput('datoIcon', 'arrow-right');
    expect((host.component as any).injectSvg).toHaveBeenCalledTimes(1);
    expect(host.hostElement.querySelector('.dato-icon-arrow-left')).not.toExist();
    expect(host.hostElement.querySelector('.dato-icon-arrow-right')).toExist();
  });

  it('should not inject if icon is the same ', () => {
    host = createHost(`<dato-icon datoIcon="arrow-left"></dato-icon>`);
    spyOn(host.component as any, 'injectSvg');
    host.setInput('datoIcon', 'arrow-left');
    expect((host.component as any).injectSvg).not.toHaveBeenCalled();
  });

  describe('Dimensions', () => {
    it('should support custom width', function() {
      host = createHost(`<dato-icon datoIcon="arrow-left" width="200px"></dato-icon>`);
      expect(host.element).toHaveStyle({ width: '200px' });
    });

    it('should support custom height', function() {
      host = createHost(`<dato-icon datoIcon="arrow-left" height="50px"></dato-icon>`);
      expect(host.element).toHaveStyle({ height: '50px' });
    });
  });
});
