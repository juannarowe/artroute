export function getRegisterErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";

  if (code === "auth/email-already-in-use") {
    return "This email already has an account. Try logging in.";
  }
  if (code === "auth/weak-password") {
    return "The password must have at least 6 characters.";
  }
  if (code === "auth/invalid-email") {
    return "This email address is not valid.";
  }
  return "Could not create the account. Please try again.";
}
