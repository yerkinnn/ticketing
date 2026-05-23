import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@kinnn-org-1/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
