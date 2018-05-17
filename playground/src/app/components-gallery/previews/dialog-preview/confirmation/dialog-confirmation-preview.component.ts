import {
  Component,
  ContentChild,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { DatoDialog } from "../../../../../../../lib/src/services/dialog.service";

@Component({
  selector: "dato-dialog-confirmation-preview",
  templateUrl: "./dialog-confirmation-preview.component.html"
})
export class DatoDialogConfirmationPreviewComponent implements OnInit {
  @ViewChild("templateRef") private dialogTpl: TemplateRef<any>;

  constructor(private modalService: DatoDialog) {}

  ngOnInit() {}

  openDialog() {
    this.modalService
      .confirm({
        title: "Delete",
        content: "Are you sure you want to delete the entity?"
      })
      .afterClosed()
      .subscribe((result: string) => {});
  }

  openDialogWithTemplate() {
    this.modalService
      .confirm({
        title: "Delete",
        content: this.dialogTpl
      })
      .afterClosed()
      .subscribe((result: string) => {});
  }
}
