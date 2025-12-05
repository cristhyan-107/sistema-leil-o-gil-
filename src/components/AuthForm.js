// src/components/AuthForm.js
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // For future use if we save user profile
    const [error, setError] = useState("");
    const { login, signup, loginWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
                // Ideally update profile with name here
            }
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: "80vh" }}>
            <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    {isLogin ? "Bem-vindo de volta" : "Criar Conta"}
                </h2>

                {error && (
                    <div style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        color: "#fca5a5",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        fontSize: "0.9rem"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Nome</label>
                            <input
                                type="text"
                                className="glass-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Seu nome completo"
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: "1rem" }}>
                        <label>E-mail</label>
                        <input
                            type="email"
                            className="glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label>Senha</label>
                        <input
                            type="password"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="glass-button" style={{ width: "100%", marginBottom: "1rem" }}>
                        {isLogin ? "Entrar" : "Cadastrar"}
                    </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
                    <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }}></div>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>OU</span>
                    <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }}></div>
                </div>

                <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="glass-button"
                    style={{
                        width: "100%",
                        background: "white",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"></path>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"></path>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"></path>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.159 6.656 3.58 9 3.58z" fill="#EA4335"></path>
                    </svg>
                    Entrar com Google
                </button>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: "none", border: "none", color: "var(--accent-primary)", cursor: "pointer", fontWeight: "600" }}
                    >
                        {isLogin ? "Cadastre-se" : "Faça Login"}
                    </button>
                </p>
            </div>
        </div>
    );
}
