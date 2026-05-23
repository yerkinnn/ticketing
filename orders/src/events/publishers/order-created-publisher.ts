import { Publisher, OrderCreatedEvent, Subjects } from "@kinnn-org-1/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
