import { SpectatorWithHost, createHostComponentFactory } from '@netbasal/spectator';
import { DatoDraggableDirective } from './drag.directive';
import { fakeAsync, tick } from '@angular/core/testing';

describe('DatoDraggable', () => {
  let host: SpectatorWithHost<DatoDraggableDirective>;
  let createHost = createHostComponentFactory(DatoDraggableDirective);

  it(
    'should drag the element',
    fakeAsync(() => {
      host = createHost(`
      <div style="width: 200px; height: 200px; border: 1px solid lightgrey"
       class="target"
       datoDraggable
       [datoDragHandle]="h1"
       datoDragTarget=".target">
      <h1 class="handler" #h1>handler</h1>
      Content to drag
    </div>
    `);

      const handler = host.query('h1');

      const { left: initialLeft, top: initialTop } = host.queryHost('.target').getBoundingClientRect();

      host.dispatchMouseEvent(handler, 'mousedown');
      host.dispatchMouseEvent(document, 'mousemove', 100, 100);
      host.dispatchMouseEvent(document, 'mouseup');

      tick(20);

      const { left, top } = host.queryHost('.target').getBoundingClientRect();

      expect(left).toEqual(initialLeft + 100);
      expect(top).toEqual(initialTop + 100);
    })
  );
});
