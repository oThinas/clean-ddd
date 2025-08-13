import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { faker } from '@faker-js/faker';
import { Answer, type AnswerProps } from '@forum/entities/answer.entity';

export function makeAnswer(override?: Partial<AnswerProps>, id?: UniqueEntityId): Answer {
  const content = faker.lorem.text();

  return Answer.create(
    {
      content,
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  );
}
