/**
 * Returns the insertion index for the given item.
 */
function bisectRight<T>(arr: readonly T[], x: T, lt: (a: T, b: T) => boolean) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1); // equiv of Math.floor((lo + hi) / 2)
    if (lt(x, arr[mid])) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

/**
 * A datastructure to keep elements in ascending order, as defined by the "less
 * than" function you provide. The elements will be ordered according to
 * whatever you define as the "less than" for this element type, so that every
 * element is less than its successor in the list.
 *
 * const sorted = SortedList.from(
 *   [{ id: 4 }, { id: 1 }, { id: 9 }, { id: 4 }],
 *   (a, b) => a.id < b.id)
 * )
 * sorted.add({ id: 5 })
 * sorted.remove({ id: 4 })  // Assuming it's the same obj ref!
 *
 * Array.from(sorted)
 * [{ id: 1 }, { id: 4 }, { id: 5 }, { id: 9 }])
 */
export class SortedList<T> {
  #data: T[];
  #lt: (a: T, b: T) => boolean;

  private constructor(alreadySortedList: T[], lt: (a: T, b: T) => boolean) {
    this.#lt = lt;
    this.#data = alreadySortedList;
  }

  public static with<T>(lt: (a: T, b: T) => boolean): SortedList<T> {
    return SortedList.fromAlreadySorted([], lt);
  }

  public static from<T>(arr: T[], lt: (a: T, b: T) => boolean): SortedList<T> {
    const sorted = new SortedList([], lt);
    for (const item of arr) {
      sorted.add(item);
    }
    return sorted;
  }

  public static fromAlreadySorted<T>(
    alreadySorted: T[],
    lt: (a: T, b: T) => boolean
  ): SortedList<T> {
    return new SortedList(alreadySorted, lt);
  }

  /**
   * Clones the sorted list to a new instance.
   */
  public clone(): SortedList<T> {
    return new SortedList(this.#data.slice(), this.#lt);
  }

  /**
   * Adds a new item to the sorted list, such that it remains sorted.
   */
  add(value: T): void {
    const idx = bisectRight(this.#data, value, this.#lt);
    this.#data.splice(idx, 0, value);
  }

  /**
   * Removes all values from the sorted list, making it empty again.
   * Returns whether the list was mutated or not.
   */
  clear(): boolean {
    const hadData = this.#data.length > 0;
    this.#data.length = 0;
    return hadData;
  }

  /**
   * Removes the first value matching the predicate.
   * Returns whether the list was mutated or not.
   */
  removeBy(
    predicate: (item: T) => boolean,
    limit: number = Number.POSITIVE_INFINITY
  ): boolean {
    let deleted = 0;
    for (let i = 0; i < this.#data.length; i++) {
      if (predicate(this.#data[i])) {
        this.#data.splice(i, 1);
        deleted++;
        if (deleted >= limit) {
          break;
        } else {
          i--;
        }
      }
    }
    return deleted > 0;
  }

  /**
   * Removes the given value from the sorted list, if it exists. The given
   * value must be `===` to one of the list items. Only the first entry will be
   * removed if the element exists in the sorted list multiple times.
   *
   * Returns whether the list was mutated or not.
   */
  remove(value: T): boolean {
    const idx = this.#data.indexOf(value);
    if (idx >= 0) {
      this.#data.splice(idx, 1);
      return true;
    }
    return false;
  }

  at(index: number): T | undefined {
    return this.#data[index];
  }

  get length(): number {
    return this.#data.length;
  }

  *filter(predicate: (value: T) => boolean): IterableIterator<T> {
    for (const item of this.#data) {
      if (predicate(item)) {
        yield item;
      }
    }
  }

  // XXX If we keep this, add unit tests. Or remove it.
  *findAllRight(
    predicate: (value: T, index: number) => unknown
  ): IterableIterator<T> {
    for (let i = this.#data.length - 1; i >= 0; i--) {
      const item = this.#data[i];
      if (predicate(item, i)) {
        yield item;
      }
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#data[Symbol.iterator]();
  }

  /** Finds the leftmost item that matches the predicate. */
  find(
    predicate: (value: T, index: number) => unknown,
    start?: number
  ): T | undefined {
    const idx = this.findIndex(predicate, start);
    return idx > -1 ? this.#data.at(idx)! : undefined; // eslint-disable-line no-restricted-syntax
  }

  /** Finds the leftmost index that matches the predicate. */
  findIndex(
    predicate: (value: T, index: number) => unknown,
    start = 0
  ): number {
    for (let i = Math.max(0, start); i < this.#data.length; i++) {
      if (predicate(this.#data[i], i)) {
        return i;
      }
    }
    return -1;
  }

  /** Finds the rightmost item that matches the predicate. */
  findRight(
    predicate: (value: T, index: number) => unknown,
    start?: number
  ): T | undefined {
    const idx = this.findIndexRight(predicate, start);
    return idx > -1 ? this.#data.at(idx)! : undefined; // eslint-disable-line no-restricted-syntax
  }

  /** Finds the rightmost index that matches the predicate. */
  findIndexRight(
    predicate: (value: T, index: number) => unknown,
    start = this.#data.length - 1
  ): number {
    for (let i = Math.min(start, this.#data.length - 1); i >= 0; i--) {
      if (predicate(this.#data[i], i)) {
        return i;
      }
    }
    return -1;
  }

  get rawArray(): readonly T[] {
    return this.#data;
  }
}
