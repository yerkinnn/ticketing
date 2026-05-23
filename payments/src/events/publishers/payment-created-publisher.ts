import { PaymentCreatedEvent, Publisher, Subjects } from "@kinnn-org-1/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
