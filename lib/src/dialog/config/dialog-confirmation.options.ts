import { DatoDialogOptions, getDefaultOptions } from './dialog.options';
import { ContentType } from '../../dynamic-content/dynamic-content.types';

export enum DatoActionType {
  SUCCESS = 'SUCCESS',
  DISMISSED = 'DISMISSED'
}

export type DatoDialogAction = {
  type: DatoActionType;
  caption?: string;
  data?: any;
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

const defaultActions: DatoDialogAction[] = [
  {
    type: DatoActionType.DISMISSED,
    caption: 'general.cancel'
  },
  {
    type: DatoActionType.SUCCESS,
    caption: 'general.ok'
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
