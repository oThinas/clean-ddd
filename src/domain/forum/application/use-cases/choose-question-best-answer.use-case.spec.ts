import { ChooseQuestionBestAnswerUseCase } from '@use-cases/choose-question-best-answer.use-case';
import { makeAnswer } from '@factories/make-answer';
import { makeQuestion } from '@factories/make-question';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let answersRepository: InMemoryAnswersRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    answersRepository = new InMemoryAnswersRepository();
    sut = new ChooseQuestionBestAnswerUseCase(answersRepository, questionsRepository);
  });

  it('should be able to choose the best answer for a question', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await questionsRepository.create(question);
    await answersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id);
  });

  it("should not be able to choose another user's answer for a question", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });

    await questionsRepository.create(question);
    await answersRepository.create(answer);

    await expect(
      sut.execute({
        answerId: answer.id.toString(),
        authorId: 'author-2',
      }),
    ).rejects.toThrow(new Error('Question not found'));
  });
});
