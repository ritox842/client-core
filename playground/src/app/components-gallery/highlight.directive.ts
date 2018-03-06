import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

declare const hljs: any;

@Directive({
  selector: '[datoHighlight]'
})
export class HighlightDirective implements AfterViewInit {
  @Input() datoHighlight: 'js' | 'html' | 'css';

  constructor(private host: ElementRef) {
  }

  ngAfterViewInit() {
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    const method = `${this.datoHighlight}_beautify`;
    let innerText = window[method](this.host.nativeElement.value);
    if (this.datoHighlight === 'html') {
      innerText = this.host.nativeElement.value;
      code.style.transform = 'translateX(-50px)';
      code.style.transform = 'translateX(-60px)';
      code.style.display = 'block';
    } else {
      code.style.transform = 'translateX(-60px)';
      code.style.display = 'inline-block';
    }
    code.innerText = innerText;
    pre.appendChild(code);
    this.host.nativeElement.insertAdjacentElement('afterend', pre);
    this.host.nativeElement.style.display = 'none';
    hljs.highlightBlock(pre,);
  }

}
