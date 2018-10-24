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
 * @param {string | string[]} className
 */
export function addClass(element, className: string | string[]): void {
  if (Array.isArray(className)) {
    className.forEach(name => element.classList.add(name));
  } else {
    element.classList.add(className);
  }
}

/**
 *
 * @param element
 * @param {string} className
 */
export function removeClass(element, className: string): void {
  element.classList.remove(className);
}

/**
 *
 * @param {string} tagName
 * @returns {HTMLElement}
 */
export function createElement(tagName: string) {
  return document.createElement(tagName);
}

/**
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @returns {HTMLElement}
 */
export function appendChild(parent: HTMLElement, child: Node) {
  return parent.appendChild(child);
}

/**
 *
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 */
export function prependChild(parent: HTMLElement, child: Node) {
  parent.insertBefore(child, parent.firstChild);
}

/**
 *
 * @param {HTMLElement} child
 * @returns {HTMLElement}
 */
export function appendToBody(child: HTMLElement) {
  return appendChild(document.body, child);
}

export function appendScript(source: string, id: string) {
  const script = createElement('script');
  script.innerHTML = source;
  script.id = id;
  appendToBody(script);
}

/**
 *
 * @param source
 * @param id
 */
export function appendStyle(source: string, id: string) {
  const style = createElement('style');
  style.innerHTML = source;
  style.id = id;
  appendToBody(style);
}
