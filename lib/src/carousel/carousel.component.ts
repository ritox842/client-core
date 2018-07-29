/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, QueryList, ContentChildren, AfterViewInit, ElementRef, ViewChildren, ViewChild, Input, Directive, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DatoCarouselItemDirective } from './carousel-item.directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { isNumber } from '@datorama/utils';

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
export class DatoCarouselComponent implements AfterViewInit {
  @ContentChildren(DatoCarouselItemDirective) items: QueryList<DatoCarouselItemDirective>;
  @ViewChildren(DatoCarouselItemElement, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;
  @Input() autoRun: number | boolean = false;
  @Input() loop = false;
  @Input() showControls = true;
  @Input() timing = '250ms ease-in';
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  private defaultAutoRun = 10;
  carouselWrapperStyle = {};

  constructor(private animationBuilder: AnimationBuilder, private cdr: ChangeDetectorRef) {}

  next() {
    if (!this.loop && this.currentSlide + 1 === this.items.length) return;
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset) {
    return this.animationBuilder.build([animate(this.timing, style({ transform: `translateX(-${offset}px)` }))]);
  }

  prev() {
    if (!this.loop && this.currentSlide === 0) return;

    this.currentSlide = (this.currentSlide - 1 + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  ngAfterViewInit() {
    this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
    this.carouselWrapperStyle = {
      width: `${this.itemWidth}px`
    };
    this.cdr.detectChanges();
    if (this.autoRun) {
      const interval = isNumber(this.autoRun) ? (this.autoRun as number) * 1000 : this.defaultAutoRun * 1000;
      setInterval(this.next.bind(this), interval);
    }
  }
}
