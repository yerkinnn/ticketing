import { Publisher, TicketCreatedEvent, Subjects } from "@kinnn-org-1/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
