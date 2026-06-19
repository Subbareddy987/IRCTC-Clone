export const normalizeEmail = (email = "") => email.trim().toLowerCase();

const normalizeName = (name = "") => name.trim().replace(/\s+/g, " ");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /\d/.test(password);

export const validateRegistration = ({ full_name = "", email = "", password = "" } = {}) => {
  const values = {
    full_name: normalizeName(full_name),
    email: normalizeEmail(email),
    password,
  };
  const errors = [];

  if (values.full_name.length < 2) errors.push("Full name must be at least 2 characters");
  if (!isValidEmail(values.email)) errors.push("Valid email is required");
  if (!isStrongPassword(password)) {
    errors.push("Password must be at least 8 characters and include uppercase, lowercase and a number");
  }

  return { values, errors };
};

export const validateLogin = ({ email = "", password = "" } = {}) => {
  const values = {
    email: normalizeEmail(email),
    password,
  };
  const errors = [];

  if (!isValidEmail(values.email)) errors.push("Valid email is required");
  if (!password) errors.push("Password is required");

  return { values, errors };
};
