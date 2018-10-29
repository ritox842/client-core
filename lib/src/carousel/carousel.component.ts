/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DatoCarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { isNumber } from '@datorama/utils';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { interval } from 'rxjs';

@Directive({
  selector: '.dato-carousel-item'
})
export class DatoCarouselItemElement {}

@Component({
  selector: 'dato-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoCarouselComponent implements AfterViewInit, OnDestroy {
  @ContentChildren(DatoCarouselItemDirective) items: QueryList<DatoCarouselItemDirective>;
  @ViewChild('carousel') private carousel: ElementRef;
  @Input() autoRun: number | boolean = false;
  @Input() itemWidth: number;
  @Input() loop = false;
  @Input() selectedIndex = 0;
  @Input() showControls = true;
  @Input() timing = '250ms ease-in';
  carouselUlStyle = {};
  carouselWrapperStyle = {};
  @ViewChildren(DatoCarouselItemElement, { read: ElementRef })
  private itemElements: QueryList<ElementRef>;
  private player: AnimationPlayer;
  private currentSlide = 0;
  private readonly defaultAutoRun = 10;

  constructor(private animationBuilder: AnimationBuilder, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.carouselWrapperStyle = {
      width: `${this.itemWidth}px`
    };
    this.carouselUlStyle = {
      width: `${this.itemWidth * this.itemElements.length}px`
    };
    if (this.selectedIndex) {
      this.currentSlide = this.selectedIndex;
      this.carouselUlStyle['transform'] = `translateX(-${this.currentSlide * this.itemWidth}px)`;
    }
    this.cdr.detectChanges();

    if (this.autoRun) {
      const millisecondsPerSecond = 1000;
      const source = interval((isNumber(this.autoRun) ? (this.autoRun as number) : this.defaultAutoRun) * millisecondsPerSecond);
      source.pipe(untilDestroyed(this)).subscribe(() => this.next());
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }

  get showCarouselControls(): boolean {
    return this.showControls && this.itemElements && this.itemElements.length > 1;
  }

  next() {
    if (!this.loop && this.currentSlide + 1 === this.items.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.preformSlideTransition();
  }

  prev() {
    if (!this.loop && this.currentSlide === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.items.length) % this.items.length;
    this.preformSlideTransition();
  }

  trackByFunc(index: number) {
    return index;
  }

  private buildAnimation(offset) {
    return this.animationBuilder.build([animate(this.timing, style({ transform: `translateX(-${offset}px)` }))]);
  }

  private preformSlideTransition() {
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }
}
