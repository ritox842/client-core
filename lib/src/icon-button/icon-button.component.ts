import { Attribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'dato-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoIconButtonComponent {
  /** Whether the button is disabled */
  @Input() disabled = false;
  @Input() datoIcon: string;

  constructor(
    @Attribute('datoSize') public datoSize,
    @Attribute('datoType') public datoType,
    @Attribute('datoCircle') public datoCircle
  ) {}
}
