import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, map, switchMap, filter } from 'rxjs/operators';
import { isString } from '@datorama/utils';
import { setStyle } from '../internal/helpers';

export type DraggedEvent = {
  x: number;
  y: number;
};

@Directive({
  selector: '[datoDraggable]'
})
export class DatoDraggableDirective implements AfterViewInit, OnDestroy {
  @Input()
  datoDragHandle: string | Element;
  @Input()
  datoDragTarget: string | Element;
  @Input()
  set datoDragEnabled(enabled) {
    this.enabled = enabled;
    if (this.handle) {
      setStyle(this.handle, 'cursor', enabled ? 'move' : 'default');
    }
  }
  @Output()
  dragged = new EventEmitter<DraggedEvent>();

  /** Element to be dragged */
  private target: Element;
  /** Drag handle */
  private handle: Element;
  private delta = { x: 0, y: 0 };
  private offset = { x: 0, y: 0 };
  private enabled = true;
  private destroy$ = new Subject<void>();
  private enabledFilter = source => source.pipe(filter(() => this.enabled));

  constructor(private host: ElementRef, private zone: NgZone, private renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    if (!this.datoDragTarget) {
      throw 'You need to specify the drag target';
    }

    this.handle = this.datoDragHandle instanceof Element ? this.datoDragHandle : isString(this.datoDragHandle) && this.datoDragHandle ? document.querySelector(this.datoDragHandle as string) : this.host.nativeElement;

    /** add the move cursor */
    if (this.handle && this.enabled) {
      setStyle(this.handle, 'cursor', 'move');
    }

    this.target = this.datoDragTarget instanceof Element ? this.datoDragTarget : document.querySelector(this.datoDragTarget as string);

    this.setupEvents();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  private setupEvents() {
    this.zone.runOutsideAngular(() => {
      let mousedown$ = fromEvent(this.handle, 'mousedown');
      let mousemove$ = fromEvent(document, 'mousemove');
      let mouseup$ = fromEvent(document, 'mouseup');

      let mousedrag$ = mousedown$.pipe(
        this.enabledFilter,
        switchMap((event: MouseEvent) => {
          let startX = event.clientX;
          let startY = event.clientY;

          return mousemove$.pipe(
            map((event: MouseEvent) => {
              event.preventDefault();
              this.delta = {
                x: event.clientX - startX,
                y: event.clientY - startY
              };
            }),
            takeUntil(mouseup$)
          );
        }),
        takeUntil(this.destroy$)
      );

      mousedrag$.subscribe(() => {
        if (this.delta.x === 0 && this.delta.y === 0) {
          return;
        }

        this.translate();
      });

      mouseup$
        .pipe(
          this.enabledFilter,
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.offset.x += this.delta.x;
          this.offset.y += this.delta.y;
          this.dragged.emit(this.offset);
          this.delta = { x: 0, y: 0 };
        });
    });
  }

  private translate() {
    requestAnimationFrame(() => {
      (this.target as HTMLElement).style.transform = `
        translate(${this.offset.x + this.delta.x}px,
                  ${this.offset.y + this.delta.y}px)
      `;
    });
  }
}
