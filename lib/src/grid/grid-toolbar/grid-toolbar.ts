export enum RowSelectionType {
  SINGLE = 'single',
  MULTI = 'multi',
  ALWAYS = 'always',
  NONE = 'none'
}

export type showWhenFunc = ( data : any ) => boolean;

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

export interface ToolbarAction {
  actionType? : ToolbarActionType;
  order? : number;
  text? : string;
  icon? : string;
  showWhen? : RowSelectionType | showWhenFunc;
  click? : () => void;
}
