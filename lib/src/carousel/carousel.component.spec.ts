import { DatoCarouselComponent, DatoCarouselItemElement } from './carousel.component';
import { createHostComponentFactory, query, queryAll, SpectatorWithHost } from '@netbasal/spectator';
import { DatoIconModule, IconRegistry } from '../../index';
import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatoCarouselItemDirective } from './carousel-item.directive';
import { discardPeriodicTasks, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

@Component({ selector: 'custom-host', template: '' })
class CustomHostComponent {
  items = [{ icon: 'edit' }, { icon: 'delete' }, { icon: 'duplicate' }, { icon: 'datosearch' }, { icon: 'pin' }];
}

function createHostFactory<T>(host: Type<T>) {
  return createHostComponentFactory({
    component: DatoCarouselComponent,
    host,
    declarations: [DatoCarouselComponent, DatoCarouselItemDirective, DatoCarouselItemElement],
    providers: [IconRegistry],
    imports: [CommonModule, DatoIconModule]
  });
}

const CONTROLS_SELECTORS = '.next, .prev';

describe('DatoCarousel', () => {
  describe('Simple List', () => {
    let host: SpectatorWithHost<DatoCarouselComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const carousel = `
              
        <dato-carousel>
          <ng-container *ngFor="let item of items;">
            <ng-container *datoCarouselItem>
              <dato-icon [datoIcon]="item.icon"></dato-icon>
            </ng-container>
          </ng-container>
        </dato-carousel>
    `;

    it('should be defined', () => {
      host = createHost(carousel);
      expect(host.component).toBeDefined();
    });

    it('should move to the next/prev slide', () => {
      host = createHost(carousel);
      expect(host.component.currentSlide).toEqual(0);
      host.component.next();
      expect(host.component.currentSlide).toEqual(1);
      host.component.next();
      expect(host.component.currentSlide).toEqual(2);
      host.component.prev();
      expect(host.component.currentSlide).toEqual(1);
    });
  });

  describe('List with No Controls', () => {
    let host: SpectatorWithHost<DatoCarouselComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const carouselNoControls = `
              
        <dato-carousel [showControls]="false">
          <ng-container *ngFor="let item of items;">
            <ng-container *datoCarouselItem>
              <dato-icon [datoIcon]="item.icon"></dato-icon>
            </ng-container>
          </ng-container>
        </dato-carousel>
    `;

    it('should not display controls', () => {
      host = createHost(carouselNoControls);
      expect(queryAll(CONTROLS_SELECTORS).length).toEqual(0);
    });
  });

  describe('List with Autorun', () => {
    let host: SpectatorWithHost<DatoCarouselComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const carouselAutoRun = `

      <dato-carousel [autoRun]="0.5">
        <ng-container *ngFor="let item of items;">
          <ng-container *datoCarouselItem>
            <dato-icon [datoIcon]="item.icon"></dato-icon>
          </ng-container>
        </ng-container>
      </dato-carousel>
  `;

    it(
      'should call next automatically after .5 seconds',
      fakeAsync(() => {
        host = createHost(carouselAutoRun);
        expect(host.component.currentSlide).toEqual(0);
        tick(750);
        discardPeriodicTasks();
        expect(host.component.currentSlide).toEqual(1);
      })
    );
  });

  describe('List with Loop', () => {
    let host: SpectatorWithHost<DatoCarouselComponent>;

    const createHost = createHostFactory(CustomHostComponent);

    const carouselLoop = `
              
        <dato-carousel [loop]="true">
          <ng-container *ngFor="let item of items;">
            <ng-container *datoCarouselItem>
              <dato-icon [datoIcon]="item.icon"></dato-icon>
            </ng-container>
          </ng-container>
        </dato-carousel>
    `;

    it('should loop between slides', () => {
      host = createHost(carouselLoop);
      expect(host.component.currentSlide).toEqual(0);
      host.component.next();
      expect(host.component.currentSlide).toEqual(1);
      host.component.next();
      expect(host.component.currentSlide).toEqual(2);
      host.component.next();
      expect(host.component.currentSlide).toEqual(3);
      host.component.next();
      expect(host.component.currentSlide).toEqual(4);
      host.component.next();
      expect(host.component.currentSlide).toEqual(0);
      host.component.prev();
      expect(host.component.currentSlide).toEqual(4);
    });
  });
});
