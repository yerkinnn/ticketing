import { Publisher, TicketUpdatedEvent, Subjects } from "@kinnn-org-1/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
