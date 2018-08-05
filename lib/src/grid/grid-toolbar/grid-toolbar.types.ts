/**
 * @license
 * Copyright Datorama. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License 2.0 license that can be
 * found in the LICENSE file at https://github.com/datorama/client-core/blob/master/LICENSE
 */

import { ToolbarConfirmation, ToolbarHandler } from './grid-toolbar-handlers';

export enum RowSelectionType {
  SINGLE = 'single',
  MULTI = 'multi',
  ALWAYS = 'always',
  NONE = 'none'
}

export type showWhenFunc = (data: any) => boolean;

/**
 * Define the type of this action
 */
export enum ToolbarActionType {
  /**
   * Provide a predefined add button
   */
  Add = 'Add',

  /**
   * Provide a predefined edit button
   */
  Edit = 'Edit',

  /**
   * Provide a predefined delete button
   */
  Delete = 'Delete',

  /**
   * Provide a predefined copy button
   */
  Copy = 'Copy',

  /**
   * Provide a custom button, that will be placed on the left side
   */
  Button = 'Button',

  /**
   * Provide a custom button, that will be placed inside the menu
   */
  MenuItem = 'MenuItem'
}

export enum ToolbarArea {
  /**
   * This area, preserved for build-in actions
   */
  InternalArea = 'InternalArea',

  /**
   * This area, preserved for build-in actions, such as CRUD actions
   */
  PreservedArea = 'PreservedArea',

  Left = 'Left',

  Menu = 'Menu'
}

export type ToolbarActionHandler = (<T>(selectedRows: T[]) => void) | ToolbarHandler | ToolbarConfirmation;

export interface ToolbarAction {
  /**
   * A predefined action type
   */
  actionType?: ToolbarActionType;
  order?: number;
  text?: string;
  icon?: string;
  showWhen?: RowSelectionType | showWhenFunc;
  click?: ToolbarActionHandler;
}
