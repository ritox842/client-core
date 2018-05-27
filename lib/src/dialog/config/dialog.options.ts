import { ViewContainerRef } from '@angular/core';
import { Dimensions } from '../../types/public_api';

export type DatoDialogOptions = {
  id: string;

  /**
   * Whether a backdrop element should be created for a given modal (true by default).
   */
  backdrop?: boolean;

  /**
   * An element to which to attach newly opened modal windows.
   */
  container?: Element;

  /**
   * Custom class to append to the modal window
   */
  windowClass?: string;

  /**
   * Custom data
   */
  data?: any;

  viewContainerRef?: ViewContainerRef;

  /**
   * Whether the user can use escape or clicking outside to close a modal.
   */
  enableClose: boolean;

  /**
   * Custom dialog width
   */
  width: string;

  /**
   * Custom dialog height
   */
  height: string;

  /**
   * Dialog size
   */
  size: Dimensions;

  /**
   * Whether the dialog can be drag. Defaults false.
   */
  draggable: boolean;
};

export function getDefaultOptions(): DatoDialogOptions {
  return {
    id: null,
    backdrop: true,
    container: document.body,
    windowClass: '',
    enableClose: true,
    width: null,
    height: null,
    size: Dimensions.SM,
    draggable: false
  };
}

export const dialogSizePreset = {
  [Dimensions.SM]: ['400px', '200px'],
  [Dimensions.MD]: ['560px', '280px'],
  [Dimensions.LG]: ['800px', '350px']
};

export enum DialogResultStatus {
  SUCCESS = 'SUCCESS',
  DISMISSED = 'DISMISSED'
}

/**
 * The dialog result received from afterClosed
 */
export type DatoDialogResult<T = any> = {
  status: DialogResultStatus;
  data: T;
};
