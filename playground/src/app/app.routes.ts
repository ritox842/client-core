import {Routes} from '@angular/router';
import {ComponentsGalleryComponent} from "./components-gallery/components-gallery/components-gallery.component";
import {ViewerComponent} from "./components-gallery/viewer/viewer.component";

export const ROUTES : Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/gallery'
  },
  {
    path: 'gallery',
    component: ComponentsGalleryComponent,
    children: [ {
      path: ':id',
      component: ViewerComponent
    } ]
  },
];
