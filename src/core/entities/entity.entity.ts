import { UniqueEntityId } from './unique-entity-id.entity';

export class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId();
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }
}
