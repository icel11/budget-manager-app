import { CurrencyRates } from '../types';

export const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: CurrencyRates,
): number => {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    const baseAmount = amount / fromRate;
    return baseAmount * toRate;
};

export const formatCurrency = (amount: number, currency: string): string => {
    return `${currency} ${amount.toFixed(2)}`;
};
