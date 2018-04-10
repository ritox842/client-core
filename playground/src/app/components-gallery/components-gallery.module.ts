import { TabsPreviewComponent } from "./previews/tabs-preview/tabs-preview.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { ComponentsGalleryComponent } from "./components-gallery/components-gallery.component";
import { ComponentPreviewComponent } from "./component-preview/component-preview.component";
import { RouterModule } from "@angular/router";
import { HighlightDirective } from "./highlight.directive";
import { ViewerComponent } from "./viewer/viewer.component";
import { PreviewComponent } from "./preview/preview.component";
import { previews } from "./previews";
import { TabsComponent } from "./tabs/tabs.component";
import { TabComponent } from "./tab/tab.component";
import { ApiTableComponent } from "./api-table/api-table.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DatoCoreModule } from "../../../../lib";
import { ListItemComponent } from "./list-item/list-item.component";

@NgModule({
  imports: [CommonModule, RouterModule, DatoCoreModule, ReactiveFormsModule],
  entryComponents: [previews],
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
    ListItemComponent,
    TabsPreviewComponent
  ]
})
export class ComponentsGalleryModule {}
