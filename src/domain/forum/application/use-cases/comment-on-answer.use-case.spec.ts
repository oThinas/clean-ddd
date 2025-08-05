import { makeAnswer } from '@factories/make-answer';
import { InMemoryAnswerCommentsRepository } from '@test-repositories/in-memory-answer-comments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CommentOnAnswerUseCase } from './comment-on-answer.use-case';

let answersRepository: InMemoryAnswersRepository;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository);
  });

  it('should be able to comment on answer', async () => {
    const commentContent = 'New comment';
    const answer = makeAnswer();

    await answersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: commentContent,
    });

    expect(answerCommentsRepository.items[0].content).toEqual(commentContent);
  });
});
