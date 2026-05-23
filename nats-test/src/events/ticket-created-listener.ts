import { Message } from "node-nats-streaming";
import { Listener } from "./listener";
import { TicketCreatedEvent } from "./ticker-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Ticket created:", data);

    msg.ack();
  }
}
