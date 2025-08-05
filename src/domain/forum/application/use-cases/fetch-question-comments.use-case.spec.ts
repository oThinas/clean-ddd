import { makeQuestion } from '@factories/make-question';
import { makeQuestionComment } from '@factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from '@test-repositories/in-memory-question-comments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.use-case';

let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion();
    const questionComment1 = makeQuestionComment({ questionId: question.id });
    const questionComment2 = makeQuestionComment({ questionId: question.id });
    const questionComment3 = makeQuestionComment({ questionId: question.id });

    await questionsRepository.create(question);
    await questionCommentsRepository.create(questionComment1);
    await questionCommentsRepository.create(questionComment2);
    await questionCommentsRepository.create(questionComment3);

    const { questionComments } = await sut.execute({ questionId: question.id.toString(), page: 1 });

    expect(questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question comments', async () => {
    const question = makeQuestion();

    for (let i = 1; i <= 22; i++) {
      const questionComment = makeQuestionComment({ questionId: question.id });

      await questionsRepository.create(question);
      await questionCommentsRepository.create(questionComment);
    }

    const { questionComments } = await sut.execute({ questionId: question.id.toString(), page: 2 });

    expect(questionComments).toHaveLength(2);
  });
});
