import React from "react";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../components/Loding";

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loading />;
  }
  if (!user || (requireAdmin && !user?.isAdmin)) {
    alert("로그인이 필요한 기능입니다!");
    return <Navigate to={"/"} replace />;
  }
  return children;
}
