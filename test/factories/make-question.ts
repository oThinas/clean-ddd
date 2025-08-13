import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { faker } from '@faker-js/faker';
import { Question, type QuestionProps } from '@forum/entities/question.entity';
import { Slug } from '@forum/value-objects/slug';

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
