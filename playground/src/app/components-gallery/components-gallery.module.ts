import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ComponentsGalleryComponent } from './components-gallery/components-gallery.component';
import { ComponentPreviewComponent } from './component-preview/component-preview.component';
import { RouterModule } from '@angular/router';
import { HighlightDirective } from './highlight.directive';
import { ViewerComponent } from './viewer/viewer.component';
import { PreviewComponent } from './preview/preview.component';
import { previews } from './previews';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tab/tab.component';
import { ApiTableComponent } from './api-table/api-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatoCoreModule } from '../../../../lib';
import { ListItemComponent } from './list-item/list-item.component';
import { NgContentComponent } from '../ng-content';
import { HelloComponent } from '../hello.component';
import { PanelDemoAkitaComponent, PanelDemoComponent } from './previews/panel-preview/panel-demo.component';

@NgModule({
  imports: [CommonModule, RouterModule, DatoCoreModule, ReactiveFormsModule],
  entryComponents: [previews, PanelDemoComponent, PanelDemoAkitaComponent],
  declarations: [SideNavComponent, ComponentsGalleryComponent, ComponentPreviewComponent, HighlightDirective, ViewerComponent, PreviewComponent, TabsComponent, TabComponent, ApiTableComponent, ListItemComponent, previews, HelloComponent, NgContentComponent, PanelDemoComponent, PanelDemoAkitaComponent]
})
export class ComponentsGalleryModule {}
