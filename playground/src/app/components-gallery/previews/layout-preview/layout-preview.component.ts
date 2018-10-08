import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-layout-preview',
  templateUrl: './layout-preview.component.html',
  styleUrls: ['./layout-preview.component.scss']
})
export class LayoutPreviewComponent implements OnInit {
  header = new FormControl('Header Text');
  isFocused: boolean = false;

  constructor() {}

  ngOnInit() {
    //setTimeout(() => {
    //  this.header.setValue('Placeholder');
    //}, 0)
  }

  focus() {
    this.isFocused = true;
  }

  blur() {
    this.isFocused = false;
  }
}
