import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { QuestionComment } from '@entities/question-comment.entity';
import { faker } from '@faker-js/faker';

export function makeQuestionComment(override?: Partial<QuestionComment>, id?: UniqueEntityId): QuestionComment {
  const content = faker.lorem.sentence();

  return QuestionComment.create(
    {
      content,
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  );
}
