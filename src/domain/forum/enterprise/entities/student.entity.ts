import { Entity } from '@/core/entities/entity.entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';

interface StudentProps {
  name: string;
}

export class Student extends Entity<StudentProps> {
  static create(props: StudentProps, id?: UniqueEntityId): Student {
    return new Student(props, id);
  }
}
