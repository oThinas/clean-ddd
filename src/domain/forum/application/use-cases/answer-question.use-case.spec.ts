import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers-repository';
import { AnswerQuestionUseCase } from '@use-cases/answer-question.use-case';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it('should be able to answer a question', async () => {
    const { answer } = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New answer',
    });

    expect(answer.id).toBeTruthy();
    expect(answersRepository.items[0].id).toEqual(answer.id);
  });
});
