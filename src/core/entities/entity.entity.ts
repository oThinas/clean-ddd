import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

export abstract class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  public equals(entity: Entity<unknown>): boolean {
    if (entity === this) {
      return true;
    }

    if (entity.id === this._id) {
      return true;
    }

    return false;
  }
}
