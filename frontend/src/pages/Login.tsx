import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stops the browser from reloading the page
    setError(null);

    try {
      await login(email, password);
      navigate("/events");
    } catch {
      setError("Email or password is incorrect.");
    }
  }

  async function handleGoogleLogin() {
    setError(null);

    try {
      await loginWithGoogle();
      navigate("/events");
    } catch {
      setError("Could not sign in with Google. Please try again.");
    }
  }

  return (
    <main>
      <h1>Art Route</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit">Log in</button>
      </form>

      <button type="button" onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </main>
  );
}