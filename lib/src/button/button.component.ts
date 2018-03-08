import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'dato-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoButtonComponent implements OnInit {

  /** Whether the button is disabled */
  @Input() disabled = false;

  constructor() {
  }

  ngOnInit() {
  }

}
