import {Directive, Input, Renderer2, ElementRef} from '@angular/core';

@Directive({
  selector: '[datoColor]'
})
export class ColorDirective {

  private supportProperties = [ 'background', 'border' ];

  /** Example: <div datoColor="primary-100, accent-200 border-left border-right">text</div> */
  @Input() set datoColor( color : string ) {
    /** ["primary-100", "accent-200 border-left border-right"] */
    const colors = color.split(',');

    colors.forEach(color => {
      /**
       * split equal to:
       * ["primary-100"]
       * ["accent-200", "border-left", "border-right"]
       */
      const split = color.trim().split(' ');
      const [ colorVar ] = split;

      /** If it's the only key it should be the color value */
      if ( split.length === 1 ) {
        const klass = `${colorVar}-color`;
        this.renderer.addClass(this.host.nativeElement, klass);
        return;
      }

      /** Remove the first value (the color value) */
      split.slice(1).forEach(( prop ) => {
        let klass = `${colorVar}-${prop}`;

        /** Add the color key to borders */
        if ( this.supportProperties.indexOf(prop) > - 1 ) {
          klass = `${colorVar}-${prop}-color`;
        }

        this.renderer.addClass(this.host.nativeElement, klass);
      });


    });
  }


  constructor( private renderer : Renderer2, private host : ElementRef ) {
  }

}
