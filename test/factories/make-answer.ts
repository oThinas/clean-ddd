import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { Answer, type AnswerProps } from '@entities/answer.entity';
import { faker } from '@faker-js/faker';

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
