import { WatchedList } from '@core/entities/watched-list.entity';
import type { QuestionAttachment } from '@entities/question-attachment.entity';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId === b.attachmentId;
  }
}
