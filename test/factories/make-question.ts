import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { Question, type QuestionProps } from '@entities/question.entity';
import { Slug } from '@value-objects/slug';
import { faker } from '@faker-js/faker';

export function makeQuestion(override?: Partial<QuestionProps>, id?: UniqueEntityId): Question {
  const title = faker.lorem.sentence();

  return Question.create(
    {
      title,
      slug: Slug.createFromText(title),
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  );
}
