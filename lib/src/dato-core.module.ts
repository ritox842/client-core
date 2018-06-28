/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { DatoButtonModule } from './button/button.module';
import { DatoThemesModule } from './themes/themes.module';
import { ThemeManager } from './services/themes.manager';
import { IconRegistry } from './services/icon-registry';
import { DatoInputModule } from './input/input.module';
import { DatoIconModule } from './icon/icon.module';
import { DatoLinkButtonModule } from './link-button/link-button.module';
import { DatoTextModule } from './text/text.module';
import { DatoGridModule } from './grid/grid.module';
import { DatoDirectivesModule } from './directives/directives.module';
import { DatoLoaderModule } from './loader/loader.module';
import { DatoTranslateService } from './services/translate.service';
import { DatoSortableModule } from './sortable/sortable.module';
import { DatoAccordionModule } from './accordion/accordion.module';
import { DatoCheckboxModule } from './checkbox/checkbox.module';
import { DatoRadioModule } from './radio/radio.module';
import { DatoTabsModule } from './tabs/tabs.module';
import { DatoTogglerModule } from './toggler/toggler.module';
import { DatoEditableHeaderModule } from './editable-header/editable-header.module';
import { DatoSnackbar } from './snackbar/snackbar.service';
import { DatoSnackbarModule } from './snackbar/snackbar.module';
import { DatoDialogModule } from './dialog/dialog.module';
import { DatoDynamicContentModule } from './dynamic-content/dynamic-content.module';
import { DatoSelectModule } from './select/select.module';
import { DatoListModule } from './list/list.module';

const modules = [DatoDirectivesModule, DatoSelectModule, DatoButtonModule, DatoThemesModule, DatoSnackbarModule, DatoEditableHeaderModule, DatoInputModule, DatoIconModule, DatoLinkButtonModule, DatoTextModule, DatoTabsModule, DatoGridModule, DatoLoaderModule, DatoSortableModule, DatoAccordionModule, DatoTogglerModule, DatoCheckboxModule, DatoRadioModule, DatoDialogModule, DatoDynamicContentModule, DatoListModule];

const providers = [IconRegistry, ThemeManager, DatoSnackbar, DatoTranslateService];

@NgModule({
  imports: [],
  exports: [modules]
})
export class DatoCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DatoCoreModule,
      providers: [providers]
    };
  }
}
