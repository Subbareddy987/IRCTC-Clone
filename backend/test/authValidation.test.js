import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeEmail,
  validateLogin,
  validateRegistration,
} from "../src/utils/authValidation.js";

test("normalizeEmail trims and lowercases email addresses", () => {
  assert.equal(normalizeEmail("  User@Example.COM "), "user@example.com");
});

test("valid registration data is normalized and accepted", () => {
  const result = validateRegistration({
    full_name: "  Test   User ",
    email: " Test@Example.com ",
    password: "Password1",
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.values.full_name, "Test User");
  assert.equal(result.values.email, "test@example.com");
});

test("registration rejects weak and malformed input", () => {
  const result = validateRegistration({
    full_name: "A",
    email: "invalid",
    password: "password",
  });

  assert.equal(result.errors.length, 3);
});

test("login requires a valid email and non-empty password", () => {
  assert.equal(
    validateLogin({ email: "user@example.com", password: "secret" }).errors
      .length,
    0,
  );
  assert.equal(validateLogin({ email: "bad", password: "" }).errors.length, 2);
});
