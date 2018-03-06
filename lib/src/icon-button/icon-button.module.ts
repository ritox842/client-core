import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatoIconModule} from '../icon/icon.module';
import {DatoButtonModule} from '../button/button.module';
import {DatoIconButtonComponent} from './icon-button.component';

@NgModule({
  imports: [ CommonModule, DatoButtonModule, DatoIconModule ],
  declarations: [ DatoIconButtonComponent ],
  exports: [ DatoIconButtonComponent ]
})
export class DatoIconButtonModule {

}
