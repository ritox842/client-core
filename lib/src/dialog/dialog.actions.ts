export const enum DatoDialogActionType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY'
}

export type DatoDialogAction = {
  type: DatoDialogActionType;
  title?: string;
  onClick?: Function;
};
