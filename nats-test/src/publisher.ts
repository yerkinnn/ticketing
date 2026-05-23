import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
console.log("Publisher connecting to NATS...");

const clientId = randomBytes(4).toString("hex");
const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log(`Publisher connected to NATS with client ID ${clientId}`);

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: "123",
    title: "concert",
    price: 20,
    userId: "123-456-789",
  });
});
