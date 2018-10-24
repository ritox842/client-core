import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-rich-text-preview',
  templateUrl: './rich-text-preview.component.html',
  styleUrls: ['./rich-text-preview.component.scss']
})
export class RichTextPreviewComponent implements OnInit {
  one = new FormControl();
  two = new FormControl();

  constructor() {}

  ngOnInit() {}
}
