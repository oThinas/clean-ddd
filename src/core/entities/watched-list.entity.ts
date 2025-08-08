export abstract class WatchedList<T> {
  public currentItems: T[];
  private initialItems: T[];
  private newItems: T[];
  private removedItems: T[];

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems ?? [];
    this.initialItems = initialItems ?? [];
    this.newItems = [];
    this.removedItems = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  public getItems(): T[] {
    return this.currentItems;
  }

  public getNewItems(): T[] {
    return this.newItems;
  }

  public getRemovedItems(): T[] {
    return this.removedItems;
  }

  private isInitialItem(item: T): boolean {
    return this.initialItems.filter((initialItem) => this.compareItems(initialItem, item)).length > 0;
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.filter((currentItem) => this.compareItems(currentItem, item)).length > 0;
  }

  private isNewItem(item: T): boolean {
    return this.newItems.filter((newItem) => this.compareItems(newItem, item)).length > 0;
  }

  private isRemovedItem(item: T): boolean {
    return this.removedItems.filter((removedItem) => this.compareItems(removedItem, item)).length > 0;
  }

  private removeFromNew(item: T): void {
    this.newItems = this.newItems.filter((newItem) => !this.compareItems(newItem, item));
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter((currentItem) => !this.compareItems(currentItem, item));
  }

  private removeFromRemoved(item: T): void {
    this.removedItems = this.removedItems.filter((removedItem) => !this.compareItems(removedItem, item));
  }

  public exists(item: T): boolean {
    return this.isCurrentItem(item);
  }

  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item);
    }

    if (!this.isNewItem(item) && !this.isInitialItem(item)) {
      this.newItems.push(item);
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item);
    }
  }

  public remove(item: T): void {
    this.removeFromCurrent(item);

    if (this.isNewItem(item)) {
      this.removeFromNew(item);
      return;
    }

    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item);
    }
  }

  public update(items: T[]): void {
    const newItems = items.filter((a) => !this.getItems().some((b) => this.compareItems(a, b)));
    const removedItems = this.getItems().filter((a) => !items.some((b) => this.compareItems(a, b)));

    this.currentItems = items;
    this.newItems = newItems;
    this.removedItems = removedItems;
  }
}
