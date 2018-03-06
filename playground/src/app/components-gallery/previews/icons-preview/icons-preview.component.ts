import { Component, OnInit } from '@angular/core';
import {IconRegistry} from "../../../../../../lib";

@Component({
  selector: 'dato-icons-preview',
  templateUrl: './icons-preview.component.html',
  styleUrls: ['./icons-preview.component.scss']
})
export class IconsPreviewComponent implements OnInit {

  icons = [];

  constructor(private iconRegistry: IconRegistry) {
  }

  ngOnInit() {
    this.icons = this.iconRegistry.getAll();
  }

}
