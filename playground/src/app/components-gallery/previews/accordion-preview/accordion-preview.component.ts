import { debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-accordion-preview',
  templateUrl: './accordion-preview.component.html',
  styleUrls: ['./accordion-preview.component.scss']
})
export class AccordionPreviewComponent implements OnInit {
  constructor() {}
  expandAll;
  activeIds = [0];
  disable = false;
  data = [];
  searchControl = new FormControl();
  ngOnInit() {
    for (let index = 1; index < 5; index++) {
      this.data.push({
        title: `Title ${index}`,
        description: `Title${index} description`
      });
    }
  }

  search$ = this.searchControl.valueChanges.pipe(debounceTime(300));

  changeActive() {
    this.activeIds = [1, 2];
  }
}
