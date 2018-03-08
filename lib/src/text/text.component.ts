import {Attribute, ChangeDetectionStrategy, Component} from '@angular/core';
import {typographyType} from './font.config';

@Component({
  selector: 'dato-text',
  templateUrl: './text.component.html',
  styleUrls: [ './text.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatoTextComponent {
  klass : typographyType;

  constructor( @Attribute('type') type ) {
    this.klass = type;
  }
}
