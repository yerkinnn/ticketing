import { Message, Stan, SubscriptionOptions } from "node-nats-streaming";
import { Subjects } from "./subjects";

export interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];

  abstract queueGroupName: string;

  abstract onMessage(data: T["data"], msg: Message): void;

  protected ackWait = 5 * 1000;

  constructor(private readonly client: Stan) {}

  private subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }

  private parseMessage(msg: Message): T["data"] {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }

  public listen(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received #${msg.getSequence()} - ${this.subject} / ${
          this.queueGroupName
        }`
      );

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }
}
