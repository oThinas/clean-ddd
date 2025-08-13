import { WatchedList } from '@core/entities/watched-list.entity';
import type { QuestionAttachment } from '@forum/entities/question-attachment.entity';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId);
  }
}
