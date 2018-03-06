import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { pallete } from '../../themes';

@Component({
  selector: 'dato-colors-preview',
  templateUrl: './colors-preview.component.html',
  styleUrls: ['./colors-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorsPreviewComponent implements OnInit {
  colors = Object.keys(pallete.light);

  group: { accent: string[], primary: string[] } = this.colors.reduce((acc, color) => {
    const type = color.includes('accent') ? 'accent' : 'primary';
    acc[type] = acc[type] || [];
    acc[type].push(color);
    return acc;
  }, {} as { accent: string[], primary: string[] });

  constructor() {
  }

  ngOnInit() {

  }

}
