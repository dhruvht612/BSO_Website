import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ allow, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface text-ink">
        <div className="rounded-2xl border border-border-subtle bg-surface-muted px-6 py-4 text-sm">
          Loading portal...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return children;
}
