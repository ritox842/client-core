import {
  Component,
  ContentChild,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { DatoDialog } from "../../../../../../../lib/src/dialog/dialog.service";
import { ConfirmationType } from "../../../../../../../lib/src/dialog/config/dialog-confirmation.options";

@Component({
  selector: "dato-dialog-confirmation-preview",
  templateUrl: "./dialog-confirmation-preview.component.html"
})
export class DatoDialogConfirmationPreviewComponent implements OnInit {
  @ViewChild("templateRef") private dialogTpl: TemplateRef<any>;

  constructor(private modalService: DatoDialog) {}

  ngOnInit() {}

  openDialog(isDisruptive = false) {
    const options = {
      [ConfirmationType.WARNING]: {
        title: "Remove Mickey From Disney?",
        content:
          "Are you sure you want yo remove Mickey Mouse from Disney?<br/>Caution: This cannot be undone."
      },
      [ConfirmationType.DISRUPTIVE_WARNING]: {
        title: "Delete All Selected Data?",
        content: "Deleting data is irreversible. Would you like to proceed?",
        confirmationType: ConfirmationType.DISRUPTIVE_WARNING
      }
    };

    this.modalService
      .confirm(
        isDisruptive
          ? options[ConfirmationType.DISRUPTIVE_WARNING]
          : options[ConfirmationType.WARNING]
      )
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
