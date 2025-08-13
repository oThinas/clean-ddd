import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { Optional } from '@core/types/optional';

export interface [EntityName]Props
{
  // Define all properties here
  // Example properties:
  // name: string;
  // email: string;
  // createdAt: Date;
  // updatedAt?: Date;
}

export class [EntityName] extends Entity<[EntityName]Props> {
  // Getters for all properties
  // Example getters:
  // get name(): string {
  //   return this.props.name;
  // }
  // 
  // get email(): string {
  //   return this.props.email;
  // }
  // 
  // get createdAt(): Date {
  //   return this.props.createdAt;
  // }
  // 
  // get updatedAt(): Date | undefined {
  //   return this.props.updatedAt;
  // }

  // Private touch method to update updatedAt
  private touch(): void 
    this.props.updatedAt = new Date();

  // Setters that call touch() method
  // Example setters:
  // set name(value: string) {
  //   this.props.name = value;
  //   this.touch();
  // }
  // 
  // set email(value: string) {
  //   this.props.email = value;
  //   this.touch();
  // }

  // Static create method for instantiation
  static create(
    props: Optional<[EntityName]Props, 'createdAt'>, 
    id?: UniqueEntityId
  ): [EntityName] 
    return new [EntityName](
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
}
