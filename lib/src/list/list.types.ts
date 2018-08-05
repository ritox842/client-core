import { DatoGroupComponent } from '../options/group.component';
import { DatoAccordionGroupComponent } from '../accordion/public_api';

/**
 * @param {SelectSize} size
 * @returns {any}
 */
export function getListOptionHeight() {
  return 35;
}

/**
 * Supported list groups
 */
export type ListGroupComponent = DatoAccordionGroupComponent | DatoGroupComponent;

/**
 * The resturned search results
 */
export type ListSearchResult = { results: any[]; hasResults: boolean };
