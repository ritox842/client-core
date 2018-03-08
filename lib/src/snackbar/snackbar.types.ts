/**
 * Snackbar messages types
 */
export enum SnackbarType {
  INFO,
  SUCCESS,
  ERROR,
  DRAMATIC_SUCCESS,
  DRAMATIC_ERROR
}

/**
 * Snackbar Options
 */
export type SnackbarOptions = {
  text : string;
  type : SnackbarType;
  dismissible : boolean;
  undoFunction : Function | null;
  detailsFunction : Function | null;
}

/**
 *
 * @returns {SnackbarOptions}
 */
export function getDefaults() : SnackbarOptions {
  return {
    text: '',
    type: SnackbarType.INFO,
    dismissible: false,
    undoFunction: null,
    detailsFunction: null
  }
}