import { Observable } from 'rxjs';

/**
 * Dirty Check the source value. The default comparator is JSON.stringify(head, current).
 * @example
 * this.todosQuery.select(state => state.ui).pipe(
 *   dirtyCheck()
 * ).subscribe(isDirty => ...);
 */
export const dirtyCheck = (config: { comparator?: Function } = {}) => <T>(source: Observable<T>) =>
  new Observable<boolean>(observer => {
    let head: T;
    const comparator = config.comparator || ((source: T, dest: T) => JSON.stringify(source) === JSON.stringify(dest));

    return source.subscribe({
      next(value: T) {
        if (!head) {
          head = value;
        } else {
          const isDirty = comparator(head, value) === false;
          observer.next(isDirty);
        }
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
        head = null;
      }
    });
  });
