import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();
console.log("Listener connecting to NATS...");

const clientId = randomBytes(4).toString("hex");
const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log(`Listener connected to NATS with client ID ${clientId}`);

  stan.on("close", () => {
    console.log(`NATS connection closed for clientId: ${clientId}`);
    process.exit();
  });

  const listener = new TicketCreatedListener(stan);

  listener.listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
