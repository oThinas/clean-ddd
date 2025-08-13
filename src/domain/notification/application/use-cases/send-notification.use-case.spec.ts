import { SendNotificationUseCase } from '@notification/use-cases/send-notification.use-case';
import { InMemoryNotificationsRepository } from '@test-repositories/in-memory-notifications.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let notificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(notificationsRepository);
  });

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'This is a notification',
      recipientId: '1',
      title: 'New notification',
    });

    expect(result.isSuccess()).toBe(true);
    expect(notificationsRepository.items.length).toBe(1);
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification);
  });
});
