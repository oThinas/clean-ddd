import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeAnswer } from '@factories/make-answer';
import { makeQuestion } from '@factories/make-question';
import { ChooseQuestionBestAnswerUseCase } from '@forum/use-cases/choose-question-best-answer.use-case';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { InMemoryQuestionAttachmentsRepository } from '@test-repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
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

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-2',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
