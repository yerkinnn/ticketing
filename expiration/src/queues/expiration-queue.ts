import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface ExpirationQueuePayload {
  orderId: string;
}

export const expirationQueue = Queue<ExpirationQueuePayload>(
  "order:expiration",
  {
    redis: {
      host: process.env.REDIS_HOST,
    },
  }
);

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});
