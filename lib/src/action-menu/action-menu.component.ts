import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  ViewEncapsulation
} from "@angular/core";
import {DatoOriginDirective} from "../directives/public_api";
import Popper from 'popper.js';
import {DatoDropdownComponent} from "./../shared/dropdown/dropdown.component";
import PopperOptions = Popper.PopperOptions;

// TODO: wrap within overlay/animations

@Component({
  selector: 'dato-action-menu',
  template: '<ng-content></ng-content>',
  styleUrls: [ './action-menu.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoActionMenuComponent implements AfterContentInit, OnDestroy {

  @ContentChild(DatoOriginDirective) origin : DatoOriginDirective;
  @ContentChild(DatoDropdownComponent) dropdown : DatoDropdownComponent;

  @Input() placement = "bottom-start";

  private popper : Popper;
  private isOpen = false;
  private originSub;

  constructor( private host : ElementRef,
               private renderer : Renderer2 ) {
  }

  // @HostListener("document:click", [ "$event.target" ])
  // click( target ) {
  //   if ( ! (this.host.nativeElement as HTMLElement).contains(target) ) {
  //     this.close();
  //   }
  // }


  /**
   * Subscribe to the origin click event
   */
  ngAfterContentInit() {
    this.originSub = this.origin.click.subscribe(_ => {

      this.isOpen = ! this.isOpen;
      if ( this.isOpen ) {
        this.open();
      } else {
        this.close();
      }
    });
  }

  /**
   * Append the dropdown to body and init popper
   */
  open() {
    // const overlay = this.createOverlay();
    // overlay.appendChild(this.dropdown.element);
    document.body.appendChild(this.dropdown.element)
    this.popper = new Popper(this.origin.element, this.dropdown.element, this.getOptions() as any);
  }


  /**
   * Destroy popper and hide the dropdown
   */
  close() {
    this.isOpen = false;
    this.popper && this.popper.destroy();
    this.toggleDropdown(false);
  }

  /**
   *
   * @param {boolean} show
   * @private
   */
  private toggleDropdown( show = true ) {
    const display = show ? "inline-block" : "none";
    this.renderer.setStyle(this.dropdown.element, "display", display);
  }

  /**
   *
   * @returns Partial<PopperOptions>
   * @private
   */
  private getOptions() {
    return {
      placement: this.placement,
      removeOnDestroy: true,
      modifiers: {
        applyStyle: {
          onLoad: () => {
            this.toggleDropdown();
          }
        }
      }
    }
  }

  private createOverlay() {
    const div = this.renderer.createElement('div');
    div.classList.add('dato-overlay-clean');
    document.body.appendChild(div);
    return div;
  }

  /**
   * Cleaning
   */
  ngOnDestroy() {
    this.originSub && this.originSub.unsubscribe();
    this.close();
  }

}