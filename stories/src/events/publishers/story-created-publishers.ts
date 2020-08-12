import { Publisher, StoryCreatedEvent, Subjects } from '@hn-hub/common';

export class StoryCreatedPublisher extends Publisher<StoryCreatedEvent> {
    subject: Subjects.StoryCreated = Subjects.StoryCreated;
}