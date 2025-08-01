import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { DeleteAnswerUseCase } from '@use-cases/delete-answer.use-case';
import { makeAnswer } from '@factories/make-answer';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers-repository';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(answersRepository);
  });

  it('should be able to delete an answer', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    await sut.execute({ authorId, answerId });

    expect(answersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an answer with wrong author', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);

    await expect(sut.execute({ authorId: 'author-2', answerId })).rejects.toThrow(new Error('Answer not found'));
    expect(answersRepository.items).toHaveLength(1);
  });
});
