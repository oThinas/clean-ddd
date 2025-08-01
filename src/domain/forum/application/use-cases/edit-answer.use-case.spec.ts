import { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditAnswerUseCase } from './edit-answer.use-case';

let answersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(answersRepository);
  });

  it('should be able to edit a answer', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    await sut.execute({
      authorId,
      answerId,
      content: 'New content',
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: 'New content',
    });
  });
});
