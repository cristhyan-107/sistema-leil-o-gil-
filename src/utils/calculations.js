// src/utils/calculations.js

export const calculateFinancials = (property) => {
    const {
        auctionPrice = 0,
        renovationCost = 0,
        otherCosts = 0,
        projectedSaleValue = 0,
        realSaleValue = 0,
    } = property;

    const totalCost = Number(auctionPrice) + Number(renovationCost) + Number(otherCosts);

    // Projected
    const projectedProfit = Number(projectedSaleValue) - totalCost;
    const projectedROE = totalCost > 0 ? (projectedProfit / totalCost) * 100 : 0;

    // Executed (only if realSaleValue is provided)
    let executedProfit = 0;
    let executedROE = 0;
    const isSold = Number(realSaleValue) > 0;

    if (isSold) {
        executedProfit = Number(realSaleValue) - totalCost;
        executedROE = totalCost > 0 ? (executedProfit / totalCost) * 100 : 0;
    }

    return {
        totalCost,
        projectedProfit,
        projectedROE,
        executedProfit,
        executedROE,
        isSold
    };
};

export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
};

export const formatPercent = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format((value || 0) / 100);
};
