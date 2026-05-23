import { Publisher, OrderCancelledEvent, Subjects } from "@kinnn-org-1/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
