import { Injectable } from '@angular/core';
import { DatoDialog } from '../../dialog/dialog.service';
import { ToolbarAction } from './grid-toolbar.types';
import { GridApi } from 'ag-grid';
import { DatoDialogResult } from '../../dialog/config/dialog.options';
import { ToolbarConfirmation, ToolbarConfirmationHandlerResult, ToolbarHandler, ToolbarHandlerResult } from './grid-toolbar-handlers';
import { DatoGridAPI } from '../dato-grid-api';

@Injectable()
export class GridToolbarService {
  constructor(private dialog: DatoDialog) {}

  executeAction(action: ToolbarAction, api: DatoGridAPI) {
    if (!action.click) {
      return;
    }

    const selectedRows = api.getSelectedRows();

    if (action.click instanceof ToolbarHandler) {
      const arg: ToolbarHandlerResult = {
        gridApi: api,
        selectedRows
      };
      this.executeHandler(action.click, arg);
    } else if (typeof action.click === 'function') {
      action.click(selectedRows);
    }
  }

  /**
   * Run the handler
   * @param {ToolbarHandler} handler
   * @param {GridApi} gridApi
   * @param {any[]} selectedRows
   */
  private executeHandler(handler: ToolbarHandler, arg: ToolbarHandlerResult) {
    if (handler instanceof ToolbarConfirmation) {
      this.showConfirmation(handler as ToolbarConfirmation, arg);
    } else {
      handler.beforeHandle(arg);
      handler.handle(arg);
    }
  }

  /**
   * Run the confirmation handler
   * @param {ToolbarConfirmation} confirmation
   * @param {GridApi} gridApi
   * @param {any[]} selectedRows
   */
  private showConfirmation(confirmation: ToolbarConfirmation, arg: ToolbarHandlerResult) {
    let confirmArg: ToolbarConfirmationHandlerResult = {
      ...arg,
      dialog: this.dialog,
      dialogResult: null
    };

    confirmation.beforeHandle(confirmArg);

    const dialogRef = this.dialog.confirm(confirmation.options.dialogOptions);

    dialogRef.afterClosed().subscribe((result: DatoDialogResult) => {
      confirmArg.dialogResult = result;
      confirmation.handle(confirmArg);
    });
  }
}
