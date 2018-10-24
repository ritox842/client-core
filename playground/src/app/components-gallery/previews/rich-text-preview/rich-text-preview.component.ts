import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dato-rich-text-preview',
  templateUrl: './rich-text-preview.component.html',
  styleUrls: ['./rich-text-preview.component.scss']
})
export class RichTextPreviewComponent implements OnInit {
  one = new FormControl();
  process;
  fields = new BehaviorSubject([{ label: 'Query.CLICKS', value: '{Query(CLICKS)}' }, { label: 'Query.IMPRESSIONS', value: '{Query(IMPRESSIONS)}' }]);

  autocomplete = {
    delimiter: '{',
    source: (query, process, delimiter) => {
      this.fields.subscribe(fields => {
        process(fields);
      });
    }
  };

  constructor() {}

  ngOnInit() {
    // setTimeout(() => {
    //   this.fields.next([{ label: 'Query.BLA', value: '{Query(BLA)}' }, { label: 'Query.NETA', value: '{Query(NETA)}' }]);
    // }, 10000);
  }
}
