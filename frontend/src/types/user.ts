export type UserRole = "user" | "admin";

// The user saved in MongoDB (GET /users/me). Not the same as the Firebase user:
// Firebase knows who you are, MongoDB knows your role in Art Route.
export interface AppUser {
  _id: string;
  firebaseUid: string;
  email?: string;
  name?: string;
  role: UserRole;
}
