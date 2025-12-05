// src/components/PropertyForm.js
"use client";
import { useState, useEffect } from "react";
import { createProperty, updateProperty } from "@/services/propertyService";
import { useAuth } from "@/context/AuthContext";
import { calculateFinancials, formatCurrency, formatPercent } from "@/utils/calculations";

export default function PropertyForm({ onClose, onSave, initialData = null }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "Apartamento",
        auctionType: "Judicial",
        address: "",
        city: "",
        state: "",
        edital: "",
        evalValue: "",
        auctionPrice: "",
        renovationCost: "",
        otherCosts: "",
        projectedSaleValue: "",
        realSaleValue: "",
        purchaseDate: "",
        saleDate: "",
        status: "Projetado"
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Convert numbers
            const dataToSave = {
                ...formData,
                evalValue: Number(formData.evalValue),
                auctionPrice: Number(formData.auctionPrice),
                renovationCost: Number(formData.renovationCost),
                otherCosts: Number(formData.otherCosts),
                projectedSaleValue: Number(formData.projectedSaleValue),
                realSaleValue: formData.realSaleValue ? Number(formData.realSaleValue) : 0,
            };

            if (initialData?.id) {
                await updateProperty(user.uid, initialData.id, dataToSave);
            } else {
                await createProperty(user.uid, dataToSave);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar imóvel");
        } finally {
            setLoading(false);
        }
    };

    // Live calculations for preview
    const financials = calculateFinancials(formData);

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)", zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "1rem"
        }}>
            <div className="glass-panel animate-fade-in" style={{
                width: "100%", maxWidth: "800px", maxHeight: "90vh",
                overflowY: "auto", padding: "2rem", position: "relative",
                background: "#0f172a" // Solid background to prevent transparency issues on modal
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: "1rem", right: "1rem",
                        background: "transparent", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer"
                    }}
                >
                    ×
                </button>

                <h2 style={{ marginBottom: "2rem" }}>
                    {initialData ? "Editar Imóvel" : "Novo Imóvel"}
                </h2>

                <form onSubmit={handleSubmit} className="grid-layout" style={{ gap: "1.5rem" }}>

                    {/* Section 1: Basic Info */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <h3 style={{ color: "var(--accent-secondary)", marginBottom: "1rem" }}>Informações Básicas</h3>
                        <div className="grid-layout" style={{ gap: "1rem" }}>
                            <div>
                                <label>Nome do Imóvel</label>
                                <input name="name" className="glass-input" value={formData.name} onChange={handleChange} required placeholder="Ex: Ap. Centro" />
                            </div>
                            <div>
                                <label>Tipo</label>
                                <select name="type" className="glass-input" value={formData.type} onChange={handleChange}>
                                    <option>Apartamento</option>
                                    <option>Casa</option>
                                    <option>Sala</option>
                                    <option>Lote</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div>
                                <label>Leilão</label>
                                <select name="auctionType" className="glass-input" value={formData.auctionType} onChange={handleChange}>
                                    <option>Judicial</option>
                                    <option>Extrajudicial</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <div className="grid-layout" style={{ gap: "1rem" }}>
                            <div style={{ gridColumn: "span 2" }}>
                                <label>Endereço</label>
                                <input name="address" className="glass-input" value={formData.address} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Cidade</label>
                                <input name="city" className="glass-input" value={formData.city} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Estado</label>
                                <input name="state" className="glass-input" value={formData.state} onChange={handleChange} required maxLength={2} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Financials */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <h3 style={{ color: "var(--accent-secondary)", marginBottom: "1rem", marginTop: "1rem" }}>Valores e Custos</h3>
                        <div className="grid-layout" style={{ gap: "1rem" }}>
                            <div>
                                <label>Valor Avaliação</label>
                                <input type="number" name="evalValue" className="glass-input" value={formData.evalValue} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Pago no Leilão</label>
                                <input type="number" name="auctionPrice" className="glass-input" value={formData.auctionPrice} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Reforma Estimada</label>
                                <input type="number" name="renovationCost" className="glass-input" value={formData.renovationCost} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Outros Custos</label>
                                <input type="number" name="otherCosts" className="glass-input" value={formData.otherCosts} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Venda Projetada</label>
                                <input type="number" name="projectedSaleValue" className="glass-input" value={formData.projectedSaleValue} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div style={{
                        gridColumn: "1 / -1",
                        background: "rgba(99, 102, 241, 0.1)",
                        padding: "1rem",
                        borderRadius: "12px",
                        border: "1px solid var(--accent-primary)"
                    }}>
                        <h4 style={{ marginBottom: "0.5rem", color: "var(--accent-secondary)" }}>Prévia dos Resultados</h4>
                        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
                            <div>
                                <small>Custo Total</small>
                                <div style={{ fontWeight: "bold" }}>{formatCurrency(financials.totalCost)}</div>
                            </div>
                            <div>
                                <small>Lucro Projetado</small>
                                <div style={{ fontWeight: "bold", color: "var(--success)" }}>{formatCurrency(financials.projectedProfit)}</div>
                            </div>
                            <div>
                                <small>ROE Projetado</small>
                                <div style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{formatPercent(financials.projectedROE)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Execution (Optional) */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <h3 style={{ color: "var(--accent-secondary)", marginBottom: "1rem", marginTop: "1rem" }}>Execução (Opcional)</h3>
                        <div className="grid-layout" style={{ gap: "1rem" }}>
                            <div>
                                <label>Valor Real de Venda</label>
                                <input type="number" name="realSaleValue" className="glass-input" value={formData.realSaleValue} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Data Compra</label>
                                <input type="date" name="purchaseDate" className="glass-input" value={formData.purchaseDate} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Data Venda</label>
                                <input type="date" name="saleDate" className="glass-input" value={formData.saleDate} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Status</label>
                                <select name="status" className="glass-input" value={formData.status} onChange={handleChange}>
                                    <option>Projetado</option>
                                    <option>Em reforma</option>
                                    <option>Vendido</option>
                                    <option>Finalizado</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem", marginTop: "1rem" }}>
                        <button type="button" onClick={onClose} className="glass-button" style={{ background: "transparent", border: "1px solid var(--glass-border)" }}>
                            Cancelar
                        </button>
                        <button type="submit" className="glass-button" style={{ flex: 1 }} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Imóvel"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
