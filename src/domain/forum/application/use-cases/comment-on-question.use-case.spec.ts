import { makeQuestion } from '@factories/make-question';
import { InMemoryQuestionCommentsRepository } from '@test-repositories/in-memory-question-comments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { CommentOnQuestionUseCase } from '@use-cases/comment-on-question.use-case';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on Question Use Case', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository);
  });

  it('should be able to comment on question', async () => {
    const commentContent = 'New comment';
    const question = makeQuestion();

    await questionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: commentContent,
    });

    expect(questionCommentsRepository.items[0].content).toEqual(commentContent);
  });
});
