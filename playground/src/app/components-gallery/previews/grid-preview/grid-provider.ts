import { GridAdvancedPreviewComponent } from "./advanced/grid-advanced-preview.component";
import { GridActionsPreviewComponent } from "./actions/grid-actions-preview.component";
import { GridPreviewComponent } from "./grid-preview.component";
import { GridBasicPreviewComponent } from "./basic/grid-basic-preview.component";
import { GridAsyncPreviewComponent } from "./async/grid-async-preview.component";
import { GridBasicToolbarPreviewComponent } from "./basic-toolbar/grid-basic-toolbar-preview.component";
import { GridToolbarDialogPreviewComponent } from "./toolbar-dialog/grid-toolbar-dialog-preview.component";
import { GridToolbarDialogCustomComponent } from "./toolbar-dialog/grid-toolbar-dialog-custom.component";
import { GridFormControlPreviewComponent } from "./form-control/grid-form-control-preview.component";
import { GridGroupingPreviewComponent } from "./grouping/grid-grouping-preview.component";

export const gridProviders = [
  GridPreviewComponent,
  GridBasicPreviewComponent,
  GridAsyncPreviewComponent,
  GridAdvancedPreviewComponent,
  GridActionsPreviewComponent,
  GridBasicToolbarPreviewComponent,
  GridToolbarDialogPreviewComponent,
  GridToolbarDialogCustomComponent,
  GridFormControlPreviewComponent,
  GridGroupingPreviewComponent
];
