import type { [EntityName] } from '@[domain]/entities/[entity-name].entity';
import type { PaginationParams } from '@core/repositories/pagination-params.repository';

export interface [EntityName]sRepository {
  findById(id: string): Promise<[EntityName] | null>;
  findBySlug(slug: string): Promise<[EntityName] | null>;
  findManyRecent(params: PaginationParams): Promise<[EntityName][]>;
  create([entityName]: [EntityName]): Promise<void>;
  save([entityName]: [EntityName]): Promise<void>;
  delete([entityName]: [EntityName]): Promise<void>;
}
