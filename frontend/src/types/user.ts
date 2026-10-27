export type UserRole = "user" | "admin";

export interface AppUser {
  _id: string;
  firebaseUid: string;
  email?: string;
  name?: string;
  role: UserRole;
}
