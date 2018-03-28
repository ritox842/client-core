import { IconRegistry } from '../../../';

export function getGridIcons(iconRegistry: IconRegistry) {
  return {
    sortAscending: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg('sort-asc')}</span>`,
    sortDescending: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg(
      'sort-desc'
    )}</span>`,
    sortUnSort: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg('sort-desc')}</span>`,
    filter: `<span class="da-grid-icon filter-icon active">${iconRegistry.getSvg('filter')}</span>`,
    menu: `<span class="da-grid-icon menu-icon">${iconRegistry.getSvg('hamburger')}</span>`,
    menuPin: `<span class="da-grid-icon menu-pin-icon">${iconRegistry.getSvg('pin')}</span>`,
    columns: `<span class="da-grid-icon columns-icon">${iconRegistry.getSvg('grid')}</span>`
  };
}
