import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { faker } from '@faker-js/faker';
import { QuestionComment } from '@forum/entities/question-comment.entity';

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
