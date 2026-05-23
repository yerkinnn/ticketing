import { Message } from "node-nats-streaming";
import {
  Listener,
  OrderCompletedEvent,
  OrderStatus,
  Subjects,
} from "@kinnn-org-1/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCompletedListener extends Listener<OrderCompletedEvent> {
  readonly subject = Subjects.OrderCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompletedEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
