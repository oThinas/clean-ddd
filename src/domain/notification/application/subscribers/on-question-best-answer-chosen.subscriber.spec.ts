import { makeAnswer } from '@factories/make-answer';
import { makeQuestion } from '@factories/make-question';
import { OnQuestionBestAnswerChosenSubscriber } from '@notification/subscribers/on-question-best-answer-chosen.subscriber';
import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@notification/use-cases/send-notification.use-case';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { InMemoryNotificationsRepository } from '@test-repositories/in-memory-notifications.repository';
import { InMemoryQuestionAttachmentsRepository } from '@test-repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { waitFor } from '@test-utils/wait-for.utils';
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let notificationsRepository: InMemoryNotificationsRepository;

let sendNotificationExecuteSpy: MockInstance<
  (request: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>;

describe('On Question Best Answer Chosen Subscriber', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
    new OnQuestionBestAnswerChosenSubscriber(answersRepository, sendNotificationUseCase);
  });

  it('should send a notification when a question has a new best answer', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    await questionsRepository.create(question);
    await answersRepository.create(answer);

    question.bestAnswerId = answer.id;
    await questionsRepository.save(question);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
