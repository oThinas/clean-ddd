import { makeAnswer } from '@factories/make-answer';
import { makeQuestion } from '@factories/make-question';
import { OnAnswerCreatedSubscriber } from '@notification/subscribers/on-answer-created.subscriber';
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
let notificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  (request: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created Subscriber', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    notificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');
    new OnAnswerCreatedSubscriber(questionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    questionsRepository.create(question);
    answersRepository.create(answer);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
