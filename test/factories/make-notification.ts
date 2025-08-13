import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { faker } from '@faker-js/faker';
import { Notification, type NotificationProps } from '@notification/entities/notification.entity';

export function makeNotification(override?: Partial<NotificationProps>, id?: UniqueEntityId): Notification {
  return Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      ...override,
    },
    id,
  );
}
