import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeNotification } from '@factories/make-notification';
import { ReadNotificationUseCase } from '@notification/use-cases/read-notification.use-case';
import { InMemoryNotificationsRepository } from '@test-repositories/in-memory-notifications.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let notificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(notificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();
    await notificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification();
    await notificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: 'another-user-id',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
