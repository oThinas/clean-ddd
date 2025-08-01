import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

interface InstructorProps {
  name: string;
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId): Instructor {
    return new Instructor(props, id);
  }
}
