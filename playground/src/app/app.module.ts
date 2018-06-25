import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from "environments/environment";
import { ROUTES } from "./app.routes";
import { AppComponent } from "./app.component";

import "../styles/styles.scss";
import { DatoCoreModule } from "../../../lib/src/dato-core.module";
import { ComponentsGalleryModule } from "app/components-gallery/components-gallery.module";
import { AtomicPageComponent } from "./atomic-page.component";
import { UtilsPageComponent } from "app/utils-page.component";
import { TranslatePipe } from "./translate.pipe";
import { APP_TRANSLATE } from "../../../lib/src/services/tokens";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AtomicPageComponent,
    UtilsPageComponent,
    TranslatePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    DatoCoreModule.forRoot(),
    ComponentsGalleryModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    environment.ENV_PROVIDERS,
    TranslatePipe,
    { provide: APP_TRANSLATE, useExisting: TranslatePipe }
  ]
})
export class AppModule {}
