import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Card, Container } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const nextUser =
        mode === "login" ? await login(email, password) : await register(name, email, password);
      navigate(nextUser.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface pt-28 pb-16">
      <Container className="max-w-xl">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Portal Access</p>
          <h1 className="mt-3 font-display text-3xl">Login to BSO Portal</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Demo admin: `admin@bsoontario.org / admin123`, member: `member@bsoontario.org / member123`
          </p>
          <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
            {mode === "register" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent"
                required
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-accent"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create member account"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
            className="mt-4 text-sm text-ink-muted hover:text-ink"
          >
            {mode === "login" ? "New here? Register as member" : "Already have an account? Login"}
          </button>
        </Card>
      </Container>
    </main>
  );
}
