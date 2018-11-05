import { Component } from '@angular/core';
import { interval, of } from 'rxjs/index';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dato-directives-preview',
  templateUrl: './directives-preview.component.html',
  styleUrls: ['./directives-preview.component.scss']
})
export class DirectivesPreviewComponent {
  interval$ = interval(1000);
  intervals = {
    intOne: interval(3000),
    intTwo: interval(3000)
  };

  test$ = of({ name: 'Akita!!' });
  disable = false;
  disableControl = new FormControl(`I'm an input with toggle enable/disable`);
  constructor() {}

  toggleEnableDisable() {
    this.disable = !this.disable;
  }
}
