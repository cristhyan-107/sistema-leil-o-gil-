// src/components/Dashboard.js
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProperties, deleteProperty } from "@/services/propertyService";
import PropertyForm from "./PropertyForm";
import PropertyDetails from "./PropertyDetails";
import { calculateFinancials, formatCurrency, formatPercent } from "@/utils/calculations";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [viewingProperty, setViewingProperty] = useState(null);
    const [filterStatus, setFilterStatus] = useState("Todos");
    const [sortBy, setSortBy] = useState("createdAt"); // createdAt, roe, profit

    const fetchProperties = async () => {
        try {
            const data = await getUserProperties(user.uid);
            setProperties(data);
        } catch (error) {
            console.error("Error loading properties", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchProperties();
    }, [user]);

    const handleDelete = async (id) => {
        if (confirm("Tem certeza que deseja excluir este imóvel?")) {
            await deleteProperty(user.uid, id);
            fetchProperties();
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setViewingProperty(null);
        setShowForm(true);
    };

    const handleViewDetails = (property) => {
        setViewingProperty(property);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingProperty(null);
    };

    const handleCloseDetails = () => {
        setViewingProperty(null);
    };

    // Calculations for Dashboard Summary
    const summary = properties.reduce((acc, curr) => {
        const fins = calculateFinancials(curr);
        acc.totalInvested += fins.totalCost;
        acc.projectedProfit += fins.projectedProfit;
        if (fins.isSold) {
            acc.executedProfit += fins.executedProfit;
        }
        return acc;
    }, { totalInvested: 0, projectedProfit: 0, executedProfit: 0 });

    const avgROE = properties.length > 0
        ? (summary.projectedProfit / summary.totalInvested) * 100
        : 0;

    // Filtering and Sorting
    const filteredProperties = properties
        .filter(p => filterStatus === "Todos" || p.status === filterStatus)
        .sort((a, b) => {
            const finA = calculateFinancials(a);
            const finB = calculateFinancials(b);
            if (sortBy === "roe") return finB.projectedROE - finA.projectedROE;
            if (sortBy === "profit") return finB.projectedProfit - finA.projectedProfit;
            // Default: Newest first
            const dateA = a.createdAt?.seconds || 0;
            const dateB = b.createdAt?.seconds || 0;
            return dateB - dateA;
        });

    return (
        <div className="container">
            {/* Header */}
            <header style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: "2rem", padding: "1rem 0", borderBottom: "1px solid var(--glass-border)"
            }}>
                <div>
                    <h2 style={{ fontSize: "1.5rem" }}>Painel de Controle</h2>
                    <p style={{ color: "var(--text-secondary)" }}>Bem-vindo, {user.displayName || user.email}</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => setShowForm(true)} className="glass-button">
                        + Novo Imóvel
                    </button>
                    <button onClick={logout} className="glass-button" style={{ background: "rgba(255,255,255,0.05)" }}>
                        Sair
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid-layout" style={{ marginBottom: "3rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Total Investido</p>
                    <h3>{formatCurrency(summary.totalInvested)}</h3>
                </div>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Lucro Projetado</p>
                    <h3 style={{ color: "var(--success)" }}>{formatCurrency(summary.projectedProfit)}</h3>
                </div>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>ROE Médio Projetado</p>
                    <h3 style={{ color: "var(--accent-primary)" }}>{formatPercent(avgROE)}</h3>
                </div>
                <div className="glass-panel" style={{ padding: "1.5rem" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Lucro Realizado</p>
                    <h3 style={{ color: "#10b981" }}>{formatCurrency(summary.executedProfit)}</h3>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <select
                    className="glass-input"
                    style={{ width: "auto" }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="Todos">Todos os Status</option>
                    <option value="Projetado">Projetado</option>
                    <option value="Em reforma">Em reforma</option>
                    <option value="Vendido">Vendido</option>
                    <option value="Finalizado">Finalizado</option>
                </select>

                <select
                    className="glass-input"
                    style={{ width: "auto" }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="createdAt">Mais Recentes</option>
                    <option value="roe">Maior ROE</option>
                    <option value="profit">Maior Lucro</option>
                </select>
            </div>

            {/* Property List */}
            {loading ? (
                <div className="loading-screen">Carregando imóveis...</div>
            ) : filteredProperties.length === 0 ? (
                <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
                    <p style={{ color: "var(--text-secondary)" }}>Nenhum imóvel encontrado.</p>
                </div>
            ) : (
                <div className="grid-layout">
                    {filteredProperties.map(property => {
                        const fins = calculateFinancials(property);
                        return (
                            <div key={property.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                                    <div>
                                        <span style={{
                                            fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px",
                                            background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px"
                                        }}>
                                            {property.status}
                                        </span>
                                        <h3 style={{ margin: "0.5rem 0 0.2rem" }}>{property.name}</h3>
                                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{property.city} - {property.state}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
                                            {formatPercent(fins.projectedROE)}
                                        </div>
                                        <small style={{ color: "var(--text-secondary)" }}>ROE</small>
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem" }}>
                                    <div>
                                        <small style={{ color: "var(--text-secondary)" }}>Investimento</small>
                                        <div>{formatCurrency(fins.totalCost)}</div>
                                    </div>
                                    <div>
                                        <small style={{ color: "var(--text-secondary)" }}>Lucro Proj.</small>
                                        <div style={{ color: "var(--success)" }}>{formatCurrency(fins.projectedProfit)}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
                                    <button
                                        onClick={() => handleViewDetails(property)}
                                        className="glass-button"
                                        style={{ flex: 1, padding: "0.5rem", fontSize: "0.9rem", background: "rgba(255,255,255,0.1)" }}
                                    >
                                        Detalhes / Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(property.id)}
                                        className="glass-button"
                                        style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5" }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showForm && (
                <PropertyForm
                    onClose={handleCloseForm}
                    onSave={fetchProperties}
                    initialData={editingProperty}
                />
            )}

            {viewingProperty && (
                <PropertyDetails
                    property={viewingProperty}
                    onClose={handleCloseDetails}
                    onEdit={() => handleEdit(viewingProperty)}
                />
            )}
        </div>
    );
}
