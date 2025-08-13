import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { faker } from '@faker-js/faker';
import { AnswerComment } from '@forum/entities/answer-comment.entity';

export function makeAnswerComment(override?: Partial<AnswerComment>, id?: UniqueEntityId): AnswerComment {
  const content = faker.lorem.sentence();

  return AnswerComment.create(
    {
      content,
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id,
  );
}
