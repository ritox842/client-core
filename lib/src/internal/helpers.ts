/**
 *
 * @param {string} selector
 * @param {Document} parent
 * @returns {Element | null}
 */
export function query(selector: string, parent = document) {
  return parent.querySelector(selector);
}

/**
 *
 * @param {string} selector
 * @param {Document} parent
 * @returns {NodeListOf<Element>}
 */
export function queryAll(selector: string, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 *
 * @param {Element} element
 * @param {string} prop
 * @param {string} value
 * @returns {void}
 */
export function setStyle(element, prop: string, value: string): void {
  element.style[prop] = value;
}

/**
 *
 * @param element
 * @param {string} className
 */
export function addClass(element, className: string): void {
  element.classList.add(className);
}

/**
 *
 * @param element
 * @param {string} className
 */
export function removeClass(element, className: string): void {
  element.classList.remove(className);
}
