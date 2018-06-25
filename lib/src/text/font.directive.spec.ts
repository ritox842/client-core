import { createHostComponentFactory, SpectatorWithHost } from '@netbasal/spectator';
import { DatoFontDirective } from './font.directive';
import { DatoCoreError } from '../errors';

describe('DatoFontDirective', () => {
  let host: SpectatorWithHost<DatoFontDirective>;

  const createHost = createHostComponentFactory(DatoFontDirective);

  it('should set the simple class by default', () => {
    host = createHost(`<div datoFont>Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('simple');
  });

  it('should throw if the class does not exists', () => {
    const klasses = ['headline', 'sub-headline', 'simple', 'simple-bold', 'simple-italic', 'note', 'note-bold', 'note-italic'];
    expect(function() {
      createHost(`<div datoFont="bla">Testing DatoFontDirective</div>`);
    }).toThrow(new DatoCoreError(`datoFont - bla doesn't exists. Valid options: ${klasses.join(', ')}`));
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="headline">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('headline');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="sub-headline">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('sub-headline');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="simple-bold">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('simple-bold');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="simple-italic">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('simple-italic');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="note">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('note');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="note-bold">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('note-bold');
  });

  it('should add the right class', () => {
    host = createHost(`<div datoFont="note-italic">Testing DatoFontDirective</div>`);
    expect(host.element).toHaveClass('note-italic');
  });
});
