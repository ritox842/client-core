import { ContentType, DatoDialogOptions, getDefaultOptions } from './dialog.options';

export enum DatoActionType {
  SUCCESS = 'SUCCESS',
  CANCEL = 'CANCEL'
}

export type DatoDialogAction = {
  type: DatoActionType;
  caption?: string;
};

export enum ConfirmationType {
  WARNING = 'warning',
  DISRUPTIVE_WARNING = 'disruptive_warning'
}

export type DatoConfirmationOptions = DatoDialogOptions & {
  /**
   * The dialog title
   */
  title: string;
  /**
   * The dialog content
   */
  content: ContentType;
  /**
   * An array of actions that will be displayed in the footer
   */
  actions: DatoDialogAction[];

  /**
   * The type of the confirmation
   */
  confirmationType: ConfirmationType;
};

const defaultActions = [
  {
    type: DatoActionType.CANCEL,
    caption: 'Cancel'
  },
  {
    type: DatoActionType.SUCCESS,
    caption: 'OK'
  }
];

export function getDefaultConfirmationOptions(): DatoConfirmationOptions {
  const confirmationOptions = {
    title: '',
    content: '',
    actions: [...defaultActions],
    confirmationType: ConfirmationType.WARNING
  };
  return { ...getDefaultOptions(), ...confirmationOptions };
}
