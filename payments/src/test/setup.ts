import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

process.env.STRIPE_KEY = "sk_test_51TYACHQ0b0Hg4w82yEJvHYRHJ31BB1UpV2qk7EV7OgKVqy979VByT2p44oOUILbTyzSHEUK1Hh1iCtXvb1cB76J300k8NP1r7u";

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();

  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = (id?: string): string[] => {
  const email = "test@test.com";

  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email,
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session object { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
