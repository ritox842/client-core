/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { DatoConfirmationOptions } from '../../dialog/config/dialog-confirmation.options';
import { DatoDialogResult, DialogResultStatus } from '../../dialog/config/dialog.options';
import { DatoDialog } from '../../dialog/dialog.service';
import { DatoGridAPI } from '../dato-grid-api';

export type ToolbarHandlerResult = {
  selectedRows: any[];
  gridApi: DatoGridAPI;
};

export type ToolbarConfirmationHandlerResult = ToolbarHandlerResult & {
  dialog: DatoDialog;
  dialogResult: DatoDialogResult;
};

export abstract class ToolbarHandler<T extends ToolbarHandlerResult = any> {
  constructor() {}

  abstract beforeHandle(result: T);

  abstract handle(result: T);
}

export interface ToolbarConfirmationOptions {
  dialogOptions?: Partial<DatoConfirmationOptions>;
  afterClosed?: (arg: ToolbarConfirmationHandlerResult) => void;
}

export class ToolbarConfirmation extends ToolbarHandler {
  constructor(public options?: ToolbarConfirmationOptions) {
    super();
    this.options = this.options || {};
  }

  beforeHandle(result: ToolbarConfirmationHandlerResult) {}

  handle(result: ToolbarConfirmationHandlerResult) {
    const afterClosed = this.options.afterClosed;
    if (afterClosed) {
      afterClosed.call(this, result);
    }
  }
}

export class ToolbarDeleteConfirmation extends ToolbarConfirmation {
  private readonly title = 'general.delete';
  private readonly content = 'Are you sure you want to delete the selected rows?';

  constructor(options?: ToolbarConfirmationOptions) {
    super(options);
  }

  beforeHandle(result: ToolbarConfirmationHandlerResult) {
    this.options.dialogOptions = {
      ...this.options.dialogOptions,
      title: this.title,
      content: this.content
    };
    super.beforeHandle(result);
  }

  handle(result: ToolbarConfirmationHandlerResult): void {
    if (result.dialogResult.status === DialogResultStatus.SUCCESS) {
      result.gridApi.removeRows(result.selectedRows);
    }
    super.handle(result);
  }
}
