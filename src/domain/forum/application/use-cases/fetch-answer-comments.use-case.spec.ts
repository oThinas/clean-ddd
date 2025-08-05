import { makeAnswer } from '@factories/make-answer';
import { makeAnswerComment } from '@factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from '@test-repositories/in-memory-answer-comments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.use-case';

let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let answersRepository: InMemoryAnswersRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    answersRepository = new InMemoryAnswersRepository();
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer();
    const answerComment1 = makeAnswerComment({ answerId: answer.id });
    const answerComment2 = makeAnswerComment({ answerId: answer.id });
    const answerComment3 = makeAnswerComment({ answerId: answer.id });

    await answersRepository.create(answer);
    await answerCommentsRepository.create(answerComment1);
    await answerCommentsRepository.create(answerComment2);
    await answerCommentsRepository.create(answerComment3);

    const { answerComments } = await sut.execute({ answerId: answer.id.toString(), page: 1 });

    expect(answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated answer comments', async () => {
    const answer = makeAnswer();

    for (let i = 1; i <= 22; i++) {
      const answerComment = makeAnswerComment({ answerId: answer.id });

      await answersRepository.create(answer);
      await answerCommentsRepository.create(answerComment);
    }

    const { answerComments } = await sut.execute({ answerId: answer.id.toString(), page: 2 });

    expect(answerComments).toHaveLength(2);
  });
});
