export class BaseCustomControl {
  onChange = (_: any) => {};
  onTouched = () => {};

  /**
   *
   * @param {(_: any) => void} fn
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /**
   *
   * @param {() => void} fn
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
