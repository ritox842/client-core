import {ButtonsPreviewComponent} from './previews/buttons-preview/buttons-preview.component';
import {TypographyPreviewComponent} from './previews/typography-preview/typography-preview.component';
import {ColorsPreviewComponent} from './previews/colors-preview/colors-preview.component';
import {IconsPreviewComponent} from './previews/icons-preview/icons-preview.component';
import {GridPreviewComponent} from './previews/grid-preview/grid-preview.component';
import {InputsPreviewComponent} from './previews/inputs-preview/inputs-preview.component';
import {ActionMenuPreviewComponent} from "./previews/action-menu-preview/action-menu-preview.component";
import {SortablePreviewComponent} from "./previews/sortable-preview/sortable-preview.component";

export const previews = [
  ButtonsPreviewComponent,
  TypographyPreviewComponent,
  ColorsPreviewComponent,
  IconsPreviewComponent,
  GridPreviewComponent,
  InputsPreviewComponent,
  ActionMenuPreviewComponent,
  SortablePreviewComponent,
];

export const routeToComponent = {
  buttons: ButtonsPreviewComponent,
  typography: TypographyPreviewComponent,
  colors: ColorsPreviewComponent,
  icons: IconsPreviewComponent,
  grid: GridPreviewComponent,
  inputs: InputsPreviewComponent,
  menu: ActionMenuPreviewComponent,
  sortable: SortablePreviewComponent
};
