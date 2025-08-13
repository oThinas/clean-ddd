import { [EntityName] } from '@[domain]/entities/[entity-name].entity';
import type { [EntityName]sRepository } from '@[domain]/repositories/[entity-name]s.repository';
import type { PaginationParams } from '@core/repositories/pagination-params.repository';

export class InMemory[EntityName]sRepository implements [EntityName]sRepository {
  public items: [EntityName][] = [];

  async findById(id: string): Promise<[EntityName] | null> {
    const [entityName] = this.items.find((item) => item.id.toString() === id);
    return [entityName] ?? null;
  }

  async findBySlug(slug: string): Promise<[EntityName] | null> {
    const [entityName] = this.items.find((item) => item.slug.value === slug);
    return [entityName] ?? null;
  }

  async findManyRecent({ page }: PaginationParams): Promise<[EntityName][]> {
    const [entityName]s = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return [entityName]s;
  }

  async create([entityName]: [EntityName]): Promise<void> {
    this.items.push([entityName]);
  }

  async save([entityName]: [EntityName]): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals([entityName].id));

    if (itemIndex >= 0) {
      this.items[itemIndex] = [entityName];
    }
  }

  async delete([entityName]: [EntityName]): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals([entityName].id));

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1);
    }
  }
}
