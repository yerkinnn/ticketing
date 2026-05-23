import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "@kinnn-org-1/common";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

// it("has a route handler listening to /api/payments for post requests", async () => {
//   const response = await request(app).post("/api/payments").send({});

//   expect(response.status).not.toEqual(404);
// });

// it("can only be accessed if the user is signed in", async () => {
//   await request(app).post("/api/payments").send({}).expect(401);
// });

// it("returns a status other than 401 if the user is signed in", async () => {});
it("return a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: "tok_visa",
    })
    .expect(404);
});

it("return a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "laskdflkajsdf",
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(401);
});

it("return a 400 when purchasing an cancelled order", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(order.userId))
    .send({
      orderId: order.id,
      token: "tok_visa",
    })
    .expect(201);

  // NOTE: it is also possible to make the test REALISTIC by fetching the charge from the Stripe API and checking if it exists
  expect(stripe.charges.create).toHaveBeenCalledWith({
    currency: "usd",
    amount: order.price * 100,
    source: "tok_visa",
  });

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: "ch_1234567890", // response.body.id,
  });
  expect(payment).not.toBeNull();
});
