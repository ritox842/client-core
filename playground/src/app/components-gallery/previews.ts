import { TabsPreviewComponent } from './previews/tabs-preview/tabs-preview.component';
import { ButtonsPreviewComponent } from './previews/buttons-preview/buttons-preview.component';
import { TypographyPreviewComponent } from './previews/typography-preview/typography-preview.component';
import { ColorsPreviewComponent } from './previews/colors-preview/colors-preview.component';
import { IconsPreviewComponent } from './previews/icons-preview/icons-preview.component';
import { GridPreviewComponent } from './previews/grid-preview/grid-preview.component';
import { InputsPreviewComponent } from './previews/inputs-preview/inputs-preview.component';
import { SortablePreviewComponent } from './previews/sortable-preview/sortable-preview.component';
import { AccordionPreviewComponent } from './previews/accordion-preview/accordion-preview.component';
import { DragPreviewComponent } from './previews/drag-preview/drag-preview.component';
import { LayoutPreviewComponent } from './previews/layout-preview/layout-preview.component';
import { SnackbarPreviewComponent } from './previews/snackbar-preview/snackbar-preview.component';
import { DialogPreviewComponent } from './previews/dialog-preview/dialog-preview.component';
import { dialogPreviewComponents } from './previews/dialog-preview/dialog-preview.providers';
import { gridProviders } from './previews/grid-preview/grid-provider';
import { SelectPreviewComponent } from './previews/select-preview/select-preview.component';
import { ListPreviewComponent } from './previews/list-preview/list-preview.component';
import { ToastPreviewComponent } from './previews/toast-preview/toast-preview.component';
import { TooltipPreviewComponent } from './previews/tooltip-preview/tooltip-preview.component';
import { PanelPreviewComponent } from './previews/panel-preview/panel-preview.component';
import { CarouselPreviewComponent } from './previews/carousel-preview/carousel-preview.component';
import { CustomToastComponent } from './previews/toast-preview/custom-toast.component';
import { MiscellaneousPreviewComponent } from './previews/miscellaneous-preview/miscellaneous-preview.component';
import { AcePreviewComponent } from './previews/ace-preview/ace-preview.component';
import { RichTextPreviewComponent } from './previews/rich-text-preview/rich-text-preview.component';
import { ChangeLogComponent } from './previews/changelog/change-log.component';
import { DirectivesPreviewComponent } from './previews/directives-preview/directives-preview.component';

export const previews = [DirectivesPreviewComponent, ChangeLogComponent, ButtonsPreviewComponent, TypographyPreviewComponent, ColorsPreviewComponent, IconsPreviewComponent, InputsPreviewComponent, SortablePreviewComponent, AccordionPreviewComponent, DragPreviewComponent, TabsPreviewComponent, LayoutPreviewComponent, ListPreviewComponent, CarouselPreviewComponent, SnackbarPreviewComponent, SelectPreviewComponent, ToastPreviewComponent, TooltipPreviewComponent, PanelPreviewComponent, CustomToastComponent, MiscellaneousPreviewComponent, RichTextPreviewComponent, AcePreviewComponent, ...dialogPreviewComponents, ...gridProviders];

export const routeToComponent = {
  buttons: ButtonsPreviewComponent,
  typography: TypographyPreviewComponent,
  colors: ColorsPreviewComponent,
  icons: IconsPreviewComponent,
  grid: GridPreviewComponent,
  inputs: InputsPreviewComponent,
  sortable: SortablePreviewComponent,
  accordion: AccordionPreviewComponent,
  drag: DragPreviewComponent,
  tabs: TabsPreviewComponent,
  layout: LayoutPreviewComponent,
  list: ListPreviewComponent,
  carousel: CarouselPreviewComponent,
  snackbar: SnackbarPreviewComponent,
  dialog: DialogPreviewComponent,
  select: SelectPreviewComponent,
  toast: ToastPreviewComponent,
  tooltip: TooltipPreviewComponent,
  panel: PanelPreviewComponent,
  richtext: RichTextPreviewComponent,
  ace: AcePreviewComponent,
  miscellaneous: MiscellaneousPreviewComponent,
  changelog: ChangeLogComponent,
  directives: DirectivesPreviewComponent
};
