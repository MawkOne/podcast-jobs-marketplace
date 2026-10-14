/**
 * Demo auth — isolated from lib/data.ts so the bcryptjs dependency enters
 * ONLY the login form's client bundle. lib/data.ts is imported by every
 * page; a require() there wired a bcrypt vendor chunk into every server
 * route (the "Cannot find module './vendor-chunks/bcryptjs.js'" 500s).
 *
 * Placeholder for POST /api/auth/login — real deployments call the API and
 * store the JWT; the return shape matches API_SPEC.md §2.
 */
import bcrypt from "bcryptjs";
import { USERS } from "@/lib/data";

export function verifyCredentials(email: string, password: string): {
  access_token: string;
  user: Omit<import("./data").UserRecord, "password_hash">;
} | null {
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.is_active,
  );
  if (!user) return null;
  if (!bcrypt.compareSync(password, user.password_hash)) return null;
  const { password_hash: _hash, ...safe } = user;
  return { access_token: `demo-token-${user.user_id}`, user: safe };
}
