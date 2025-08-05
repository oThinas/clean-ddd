import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { AnswerComment } from '@entities/answer-comment.entity';
import { faker } from '@faker-js/faker';

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
