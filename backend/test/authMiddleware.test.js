import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { verifytoken } from "../src/middleware/authMiddleware.js";

process.env.jwt_secret = "test-secret";

const runMiddleware = (authorization) => {
  const req = { headers: { authorization } };
  const response = {};
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (body) => {
    response.body = body;
    return response;
  };
  let nextCalled = false;

  verifytoken(req, response, () => {
    nextCalled = true;
  });

  return { req, response, nextCalled };
};

test("rejects missing and malformed bearer tokens", () => {
  for (const value of [undefined, "", "token", "Basic abc"]) {
    const result = runMiddleware(value);
    assert.equal(result.response.statusCode, 401);
    assert.equal(result.nextCalled, false);
  }
});

test("accepts a valid bearer token", () => {
  const token = jwt.sign({ user_id: 42 }, process.env.jwt_secret, {
    expiresIn: "5m",
  });
  const result = runMiddleware(`Bearer ${token}`);

  assert.equal(result.nextCalled, true);
  assert.equal(result.req.user.user_id, 42);
});

test("returns a specific response for expired tokens", () => {
  const token = jwt.sign(
    { user_id: 42, exp: Math.floor(Date.now() / 1000) - 1 },
    process.env.jwt_secret,
  );
  const result = runMiddleware(`Bearer ${token}`);

  assert.equal(result.response.statusCode, 401);
  assert.equal(result.response.body.message, "Token expired");
});
