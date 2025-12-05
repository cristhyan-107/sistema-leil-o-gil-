// src/components/PropertyDetails.js
"use client";
import { calculateFinancials, formatCurrency, formatPercent } from "@/utils/calculations";

export default function PropertyDetails({ property, onClose, onEdit }) {
    const fins = calculateFinancials(property);

    // Chart Data Preparation
    const saleValue = fins.isSold ? Number(property.realSaleValue) : Number(property.projectedSaleValue);
    const profit = fins.isSold ? fins.executedProfit : fins.projectedProfit;
    const maxValue = Math.max(fins.totalCost, saleValue, profit);

    const getHeight = (val) => `${Math.max((val / maxValue) * 100, 0)}%`;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)", zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "1rem"
        }}>
            <div className="glass-panel animate-fade-in" style={{
                width: "100%", maxWidth: "900px", maxHeight: "90vh",
                overflowY: "auto", padding: "2rem", position: "relative",
                background: "#0f172a"
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <div>
                        <h2 style={{ marginBottom: "0.5rem" }}>{property.name}</h2>
                        <span style={{
                            background: "rgba(99, 102, 241, 0.2)", color: "#818cf8",
                            padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", textTransform: "uppercase"
                        }}>
                            {property.status}
                        </span>
                    </div>
                    <button onClick={onEdit} className="glass-button">
                        Editar Imóvel
                    </button>
                </div>

                <div className="grid-layout" style={{ gap: "2rem" }}>

                    {/* Main Stats */}
                    <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                        <div className="glass-panel" style={{ padding: "1rem", background: "rgba(255,255,255,0.03)" }}>
                            <small style={{ color: "var(--text-secondary)" }}>Lucro {fins.isSold ? "Real" : "Proj."}</small>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--success)" }}>
                                {formatCurrency(profit)}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: "1rem", background: "rgba(255,255,255,0.03)" }}>
                            <small style={{ color: "var(--text-secondary)" }}>ROE {fins.isSold ? "Real" : "Proj."}</small>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-primary)" }}>
                                {formatPercent(fins.isSold ? fins.executedROE : fins.projectedROE)}
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: "1rem", background: "rgba(255,255,255,0.03)" }}>
                            <small style={{ color: "var(--text-secondary)" }}>Custo Total</small>
                            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                {formatCurrency(fins.totalCost)}
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="glass-panel" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                        <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>Análise Financeira</h3>
                        <div style={{
                            display: "flex", alignItems: "flex-end", justifyContent: "center",
                            height: "250px", gap: "4rem", paddingBottom: "1rem", borderBottom: "1px solid var(--glass-border)"
                        }}>
                            {/* Cost Bar */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>{formatCurrency(fins.totalCost)}</div>
                                <div style={{
                                    width: "60px", height: getHeight(fins.totalCost),
                                    background: "var(--text-secondary)", borderRadius: "8px 8px 0 0",
                                    transition: "height 1s ease"
                                }}></div>
                                <div style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>Custo</div>
                            </div>

                            {/* Sale Bar */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>{formatCurrency(saleValue)}</div>
                                <div style={{
                                    width: "60px", height: getHeight(saleValue),
                                    background: "var(--accent-primary)", borderRadius: "8px 8px 0 0",
                                    transition: "height 1s ease"
                                }}></div>
                                <div style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>Venda</div>
                            </div>

                            {/* Profit Bar */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ marginBottom: "0.5rem", fontWeight: "bold", color: "var(--success)" }}>{formatCurrency(profit)}</div>
                                <div style={{
                                    width: "60px", height: getHeight(profit),
                                    background: "var(--success)", borderRadius: "8px 8px 0 0",
                                    transition: "height 1s ease"
                                }}></div>
                                <div style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>Lucro</div>
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        <h3 style={{ marginBottom: "1rem", color: "var(--accent-secondary)" }}>Detalhes do Imóvel</h3>
                        <div className="glass-panel" style={{ padding: "1.5rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                                <div>
                                    <label>Tipo / Leilão</label>
                                    <div>{property.type} - {property.auctionType}</div>
                                </div>
                                <div>
                                    <label>Endereço</label>
                                    <div>{property.address}, {property.city}/{property.state}</div>
                                </div>
                                <div>
                                    <label>Avaliação</label>
                                    <div>{formatCurrency(property.evalValue)}</div>
                                </div>
                                <div>
                                    <label>Pago no Leilão</label>
                                    <div>{formatCurrency(property.auctionPrice)}</div>
                                </div>
                                <div>
                                    <label>Reforma</label>
                                    <div>{formatCurrency(property.renovationCost)}</div>
                                </div>
                                <div>
                                    <label>Outros Custos</label>
                                    <div>{formatCurrency(property.otherCosts)}</div>
                                </div>
                                <div>
                                    <label>Data Compra</label>
                                    <div>{property.purchaseDate ? new Date(property.purchaseDate).toLocaleDateString() : "-"}</div>
                                </div>
                                {property.edital && (
                                    <div>
                                        <label>Edital</label>
                                        <div>{property.edital}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
