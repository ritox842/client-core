import { TemplateRef, Type, ViewContainerRef } from '@angular/core';

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
    draggable: false
  };
}

export type ContentType<T = any> = TemplateRef<T> | Type<T> | string;
