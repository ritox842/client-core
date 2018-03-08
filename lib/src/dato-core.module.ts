import {ModuleWithProviders, NgModule} from '@angular/core';
import {DatoButtonModule} from "./button/button.module";
import {DatoThemesModule} from "./themes/themes.module";
import {ThemeManager} from "./services/themes.manager";
import {IconRegistry} from "./services/icon-registry";
import {DatoInputModule} from "./input/input.module";
import {DatoIconModule} from "./icon/icon.module";
import {DatoLinkButtonModule} from "./link-button/link-button.module";
import {DatoTextModule} from "./text/text.module";
import {DatoGridModule} from "./grid/grid.module";
import {DatoDirectives} from "./directives/directives.module";
import {DatoActionMenuModule} from "./action-menu/action-menu.module";
import {DatoDropdownModule} from "./shared/dropdown/dropdown.module";
import {DatoSnackbar} from "./services/snackbar.service";

const modules = [
  DatoDirectives,
  DatoButtonModule,
  DatoThemesModule,
  DatoInputModule,
  DatoIconModule,
  DatoLinkButtonModule,
  DatoTextModule,
  DatoGridModule,
  DatoActionMenuModule,
  DatoDropdownModule
];

const providers = [
  IconRegistry,
  ThemeManager,
  DatoSnackbar
];

@NgModule({
  imports: [],
  exports: [ modules ],
})
export class DatoCoreModule {

  static forRoot() : ModuleWithProviders {
    return {
      ngModule: DatoCoreModule,
      providers: [ providers ]
    };
  }
}
