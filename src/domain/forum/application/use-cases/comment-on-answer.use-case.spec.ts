import { makeAnswer } from '@factories/make-answer';
import { CommentOnAnswerUseCase } from '@forum/use-cases/comment-on-answer.use-case';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswerCommentsRepository } from '@test-repositories/in-memory-answer-comments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
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
