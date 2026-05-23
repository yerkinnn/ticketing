import { Publisher, OrderCompletedEvent, Subjects } from "@kinnn-org-1/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
}
