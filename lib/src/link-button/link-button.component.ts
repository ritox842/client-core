import {Component, Input} from '@angular/core';

@Component({
  selector: 'dato-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: [ './link-button.component.scss' ]
})
export class DatoLinkButtonComponent {

  /** Whether the button is disabled */
  @Input() disabled = false;
}
