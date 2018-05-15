import { TabsPreviewComponent } from "./previews/tabs-preview/tabs-preview.component";
import { ButtonsPreviewComponent } from "./previews/buttons-preview/buttons-preview.component";
import { TypographyPreviewComponent } from "./previews/typography-preview/typography-preview.component";
import { ColorsPreviewComponent } from "./previews/colors-preview/colors-preview.component";
import { IconsPreviewComponent } from "./previews/icons-preview/icons-preview.component";
import { GridPreviewComponent } from "./previews/grid-preview/grid-preview.component";
import { InputsPreviewComponent } from "./previews/inputs-preview/inputs-preview.component";
import { ActionMenuPreviewComponent } from "./previews/action-menu-preview/action-menu-preview.component";
import { SortablePreviewComponent } from "./previews/sortable-preview/sortable-preview.component";
import { GridBasicPreviewComponent } from "./previews/grid-preview/basic/grid-basic-preview.component";
import { GridActionsPreviewComponent } from "./previews/grid-preview/actions/grid-actions-preview.component";
import { AccordionPreviewComponent } from "./previews/accordion-preview/accordion-preview.component";
import { DragPreviewComponent } from "./previews/drag-preview/drag-preview.component";
import { DialogPreviewComponent } from "./previews/dialog-preview/dialog-preview.component";
import { dialogPreviewComponents } from "./previews/dialog-preview/dialog-preview.providers";

export const previews = [
  ButtonsPreviewComponent,
  TypographyPreviewComponent,
  ColorsPreviewComponent,
  IconsPreviewComponent,
  GridPreviewComponent,
  GridBasicPreviewComponent,
  GridActionsPreviewComponent,
  InputsPreviewComponent,
  ActionMenuPreviewComponent,
  SortablePreviewComponent,
  AccordionPreviewComponent,
  DragPreviewComponent,
  TabsPreviewComponent,
  ...dialogPreviewComponents
];

export const routeToComponent = {
  buttons: ButtonsPreviewComponent,
  typography: TypographyPreviewComponent,
  colors: ColorsPreviewComponent,
  icons: IconsPreviewComponent,
  grid: GridPreviewComponent,
  inputs: InputsPreviewComponent,
  menu: ActionMenuPreviewComponent,
  sortable: SortablePreviewComponent,
  accordion: AccordionPreviewComponent,
  drag: DragPreviewComponent,
  tabs: TabsPreviewComponent,
  dialog: DialogPreviewComponent
};
