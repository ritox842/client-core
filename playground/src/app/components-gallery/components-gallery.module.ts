import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideNavComponent} from './side-nav/side-nav.component';
import {ComponentsGalleryComponent} from './components-gallery/components-gallery.component';
import {ComponentPreviewComponent} from './component-preview/component-preview.component';
import {RouterModule} from '@angular/router';
import {HighlightDirective} from './highlight.directive';
import {ViewerComponent} from './viewer/viewer.component';
import {PreviewComponent} from './preview/preview.component';
import {ButtonsPreviewComponent} from './previews/buttons-preview/buttons-preview.component';
import {previews} from './previews';
import {TypographyPreviewComponent} from './previews/typography-preview/typography-preview.component';
import {TabsComponent} from './tabs/tabs.component';
import {TabComponent} from './tab/tab.component';
import {ApiTableComponent} from './api-table/api-table.component';
import {ColorsPreviewComponent} from './previews/colors-preview/colors-preview.component';
import {IconsPreviewComponent} from './previews/icons-preview/icons-preview.component';
import {GridPreviewComponent} from './previews/grid-preview/grid-preview.component';
import {InputsPreviewComponent} from './previews/inputs-preview/inputs-preview.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DatoCoreModule} from "../../../../lib";
import {ActionMenuPreviewComponent} from "./previews/action-menu-preview/action-menu-preview.component";
import {ListItemComponent} from "./list-item/list-item.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DatoCoreModule,
    ReactiveFormsModule
  ],
  entryComponents: [ previews ],
  declarations: [
    SideNavComponent,
    ComponentsGalleryComponent,
    ComponentPreviewComponent,
    HighlightDirective,
    ViewerComponent,
    PreviewComponent,
    TabsComponent,
    TabComponent,
    ApiTableComponent,
    previews,
    ListItemComponent
  ]
})
export class ComponentsGalleryModule {
}
