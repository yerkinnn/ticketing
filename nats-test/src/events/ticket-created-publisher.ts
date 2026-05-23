import { TicketCreatedEvent } from "./ticker-created-event";
import { Publisher } from "./publisher";
import { Subjects } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
