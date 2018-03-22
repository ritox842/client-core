import { Routes } from '@angular/router';
import { ComponentsGalleryComponent } from "./components-gallery/components-gallery/components-gallery.component";
import { ViewerComponent } from "./components-gallery/viewer/viewer.component";
import { AtomicPageComponent } from './atomic-page.component';
import { UtilsPageComponent } from 'app/utils-page.component';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/gallery/colors'
  },
  {
    path: 'gallery',
    component: ComponentsGalleryComponent,
    children: [{
      path: ':id',
      component: ViewerComponent
    }]
  },
  {
    path: 'atomic',
    component: AtomicPageComponent,
  },
  {
    path: 'utils',
    component: UtilsPageComponent,
  },

];
