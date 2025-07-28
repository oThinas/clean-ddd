import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  constructor(private readonly value?: string) {
    this.value = value ?? randomUUID();
  }

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }
}
