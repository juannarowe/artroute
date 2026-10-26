import { useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthContext } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (name: string, email: string, password: string) => {
    // 1. Create the account in Firebase (this also logs the user in)
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // 2. Save the name in the Firebase profile
    await updateProfile(credential.user, { displayName: name });
    // 3. Get a fresh token that includes the name. The backend creates the
    //    user in MongoDB (with this name) on the first request (GET /users/me).
    await credential.user.getIdToken(true);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const logout = async () => {
    await signOut(auth);
    queryClient.clear(); // the next user must not see the previous user's data
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
