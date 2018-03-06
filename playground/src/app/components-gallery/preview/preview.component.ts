import {Component, ElementRef, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'dato-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewComponent implements OnInit {

  @Input() title = 'Title';

  expended = false;

  constructor(private host: ElementRef) {
  }

  ngOnInit() {
  }

  toggleCode() {
    this.expended = !this.expended;
  }

  get element(): HTMLElement {
    return this.host.nativeElement;
  }
}
