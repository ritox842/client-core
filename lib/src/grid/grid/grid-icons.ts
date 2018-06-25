import { IconRegistry } from '../../../';

export function getGridIcons(iconRegistry: IconRegistry) {
  return {
    sortAscending: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg('sort-asc')}</span>`,
    sortDescending: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg('sort-desc')}</span>`,
    sortUnSort: `<span class="da-grid-icon sort-icon">${iconRegistry.getSvg('expend-arrows')}</span>`,
    filter: `<span class="da-grid-icon filter-icon active">${iconRegistry.getSvg('filter')}</span>`,
    menu: `<span class="da-grid-icon menu-icon">${iconRegistry.getSvg('more-vert')}</span>`,
    menuPin: `<span class="da-grid-icon menu-pin-icon">${iconRegistry.getSvg('pin')}</span>`,
    columns: `<span class="da-grid-icon columns-icon">${iconRegistry.getSvg('grid')}</span>`,
    groupExpanded: `<span class="da-grid-icon group-expanded-icon">${iconRegistry.getSvg('arrow-right')}</span>`,
    groupContracted: `<span class="da-grid-icon group-contracted-icon">${iconRegistry.getSvg('arrow-right')}</span>`
  };
}
