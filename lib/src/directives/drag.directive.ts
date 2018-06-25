import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';

@Directive({
  selector: '[datoDraggable]'
})
export class DatoDraggableDirective implements AfterViewInit, OnDestroy {
  @Input() datoDragHandle: string | Element;
  @Input() datoDragTarget: string | Element;
  @Input() datoDragEnabled: boolean = true;

  // Element to be dragged
  private target: Element;
  // Drag handle
  private handle: Element;
  private delta = { x: 0, y: 0 };
  private offset = { x: 0, y: 0 };

  private destroy$ = new Subject<void>();

  constructor(private host: ElementRef, private zone: NgZone, private renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    if (!this.datoDragEnabled) {
      return;
    }

    if (!this.datoDragTarget) {
      throw 'You need to specify the drag target';
    }

    this.handle = this.datoDragHandle instanceof Element ? this.datoDragHandle : typeof this.datoDragHandle === 'string' && this.datoDragHandle ? document.querySelector(this.datoDragHandle as string) : this.host.nativeElement;

    // add the move cursor
    if (this.handle) {
      this.renderer.setStyle(this.handle, 'cursor', 'move');
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

      let mousedrag$ = mousedown$
        .pipe(
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
          })
        )
        .pipe(takeUntil(this.destroy$));

      mousedrag$.subscribe(() => {
        if (this.delta.x === 0 && this.delta.y === 0) {
          return;
        }

        this.translate();
      });

      mouseup$.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.offset.x += this.delta.x;
        this.offset.y += this.delta.y;
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
