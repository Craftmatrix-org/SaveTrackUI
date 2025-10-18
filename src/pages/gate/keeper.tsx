import { Navigate } from "react-router-dom";
import { getCookie } from "@/lib/token";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getCookie("token");

  if (!token) {
    // no token, redirect to login
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
