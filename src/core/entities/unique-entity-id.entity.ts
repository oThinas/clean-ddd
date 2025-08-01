import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  constructor(private readonly value?: string) {
    this.value = value ?? randomUUID();
  }

  toString(): string {
    return this.value ?? '';
  }

  toValue(): string {
    return this.value ?? '';
  }
}
