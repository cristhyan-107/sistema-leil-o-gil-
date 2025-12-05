// src/app/page.js
"use client";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Carregando sistema...</div>;
  }

  if (!user) {
    return (
      <main className="container">
        <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "2rem" }}>
          <h1>Real Estate Control</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Gerencie seus imóveis de leilão com inteligência e precisão.
          </p>
        </div>
        <AuthForm />
      </main>
    );
  }

  return <Dashboard />;
}
