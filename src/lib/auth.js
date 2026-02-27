import { getStore, ensureUserCollections } from "@/lib/demoStore";

function createToken() {
  return `token_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function createUserId() {
  return `user_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function createUser({ name, email, password }) {
  const store = getStore();
  const normalizedEmail = email.toLowerCase().trim();

  if (store.usersByEmail[normalizedEmail]) {
    throw new Error("User already exists");
  }

  const user = {
    id: createUserId(),
    name: name?.trim() || "Sharq User",
    email: normalizedEmail,
    password,
  };

  store.usersById[user.id] = user;
  store.usersByEmail[normalizedEmail] = user.id;
  ensureUserCollections(user.id);

  return user;
}

export function loginUser({ email, password }) {
  const store = getStore();
  const normalizedEmail = email.toLowerCase().trim();
  const existingUserId = store.usersByEmail[normalizedEmail];

  if (!existingUserId) {
    return createUser({
      name: normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password,
    });
  }

  const user = store.usersById[existingUserId];
  if (user.password !== password) {
    throw new Error("Invalid email or password");
  }

  return user;
}

export function createSession(userId) {
  const store = getStore();
  const token = createToken();
  store.sessions[token] = userId;
  return token;
}

export function getUserFromRequest(req) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return null;

  const store = getStore();
  const userId = store.sessions[token];
  if (!userId) return null;

  const user = store.usersById[userId];
  if (!user) return null;

  return {
    token,
    user,
  };
}

export function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
